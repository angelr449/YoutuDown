const youtubedl = require('youtube-dl-exec');
const archiver = require('archiver');
const { PassThrough } = require('stream');
const { getInfoForStream } = require('../helpers/youtubedl');

const streamDownload = async (req, res) => {
    const { url, formatId } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'url is required' });
    }

    /* ============================
       1️⃣ OBTENER METADATA
    ============================ */
   const info = await getInfoForStream(url, { forDownload: true });

    const isPlaylist = Array.isArray(info.entries);

    /* ============================
       2️⃣ VIDEO INDIVIDUAL
    ============================ */
    if (!isPlaylist) {
        const safeTitle = info.title.replace(/[^\w\s-]/g, '');

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${safeTitle}.mp4"`
        );
        res.setHeader('Content-Type', 'video/mp4');

        const subprocess = youtubedl.exec(url, {
            format: formatId || 'mp4',
            output: '-',          // STREAM directo
            noPlaylist: true,
            jsRuntimes: 'node'
        });

        subprocess.stdout.pipe(res);

        subprocess.stderr.on('data', d =>
            console.error(d.toString())
        );

        req.on('close', () => {
            subprocess.kill('SIGKILL');
        });

        return;
    }

    /* ============================
       3️⃣ PLAYLIST → ZIP STREAM
    ============================ */
    res.setHeader(
        'Content-Disposition',
        'attachment; filename="playlist.zip"'
    );
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip');
    archive.pipe(res);

    for (const video of info.entries) {
        const stream = new PassThrough();

        const subprocess = youtubedl.exec(video.url, {
            format: formatId || 'mp4',
            output: '-',
            noPlaylist: true,
            jsRuntimes: 'node'
        });

        subprocess.stdout.pipe(stream);

        archive.append(stream, {
            name: `${video.title.replace(/[^\w\s-]/g, '')}.mp4`
        });

        subprocess.stderr.on('data', d =>
            console.error(d.toString())
        );
    }

    archive.finalize();

    req.on('close', () => {
        archive.abort();
    });
};

module.exports = streamDownload;