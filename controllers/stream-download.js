const youtubedl = require('youtube-dl-exec');
const archiver = require('archiver');
const { PassThrough } = require('stream');
const { getInfoForStream } = require('../helpers/youtubedl');

/**
 * HTTP controller that streams YouTube video or playlist downloads
 * directly to the client without writing files to disk.
 *
 * Supported scenarios:
 * - Single video: streamed directly as a media response
 * - Playlist: each video is streamed and packaged on-the-fly into a ZIP archive
 *
 * Key design decisions:
 * - No temporary files are created
 * - yt-dlp output is streamed via stdout
 * - Playlist entries are processed sequentially
 * - Client disconnects immediately cancel active streams
 *
 * @param {Object} req
 *   Express request object.
 *
 * @param {Object} res
 *   Express response object.
 */
const streamDownload = async (req, res) => {
    const { url, formatId } = req.query;

    // ============================
    // Input validation
    // ============================
    if (!url) {
        return res.status(400).json({
            error: 'url is required'
        });
    }

    /* ============================
       1️⃣ FETCH METADATA
    ============================ */
    const info = await getInfoForStream(url, { forDownload: true });

    // A playlist is identified by the presence of entries
    const isPlaylist = Array.isArray(info.entries);

    /* ============================
       2️⃣ SINGLE VIDEO STREAM
    ============================ */
    if (!isPlaylist) {

        // Generate a filesystem-safe filename
        const safeTitle = info.title.replace(/[^\w\s-]/g, '');

        // Force file download in the browser
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${safeTitle}.mp4"`
        );
        res.setHeader('Content-Type', 'video/mp4');

        // Spawn yt-dlp and stream output directly to the response
        const subprocess = youtubedl.exec(url, {
            format: formatId || 'mp4',
            output: '-',          // Stream to stdout
            noPlaylist: true,
            jsRuntimes: 'node'
        });

        // Pipe video stream to the HTTP response
        subprocess.stdout.pipe(res);

        // Log yt-dlp warnings and errors
        subprocess.stderr.on('data', d =>
            console.error(d.toString())
        );

        // Terminate process if client disconnects
        req.on('close', () => {
            subprocess.kill('SIGKILL');
        });

        return;
    }

    /* ============================
       3️⃣ PLAYLIST → ZIP STREAM
    ============================ */

    // Force ZIP download in the browser
    res.setHeader(
        'Content-Disposition',
        'attachment; filename="playlist.zip"'
    );
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip');

    // Stream ZIP archive directly to the response
    archive.pipe(res);

    // Process playlist entries sequentially
    for (const video of info.entries) {
        const stream = new PassThrough();

        // Defensive check: skip invalid playlist entries
        if (!video.id) {
            console.warn('Skipping entry without video id');
            continue;
        }

        // Construct the real YouTube URL from the video ID
        const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

        // Spawn yt-dlp for each video
        const subprocess = youtubedl.exec(videoUrl, {
            format: formatId || 'mp4',
            output: '-',          // Stream to memory
            noPlaylist: true,
            jsRuntimes: 'node'
        });

        // Pipe video stream into the ZIP archive
        subprocess.stdout.pipe(stream);

        archive.append(stream, {
            name: `${video.title.replace(/[^\w\s-]/g, '')}.mp4`
        });

        // Log errors without interrupting the ZIP stream
        subprocess.stderr.on('data', d =>
            console.error(d.toString())
        );
    }

    // Finalize ZIP archive once all entries are appended
    archive.finalize();

    // Abort ZIP generation if the client disconnects
    req.on('close', () => {
        archive.abort();
    });
};

module.exports = streamDownload;
