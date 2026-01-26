// // =========================
// // Core Node.js modules
// // =========================
// const fs = require('fs');          // File system: read and validate files
// const path = require('path');      // Safe path handling (cross-platform)

// // =========================
// // Custom helpers
// // =========================
// const { downloadWithProgress } = require('../helpers/progress-bar');
// // Helper that runs yt-dlp and reports download progress

// /**
//  * Sanitizes file names to make them safe for the filesystem.
//  * Removes invalid characters and trims whitespace.
//  *
//  * @param {string} name - Original file name
//  * @returns {string} Safe file name
//  */
// const sanitize = (name) =>
//     name.replace(/[<>:"/\\|?*]/g, '').trim();

// /**
//  * HTTP controller to download videos or playlists using
//  * previously generated yt-dlp JSON metadata.
//  *
//  * Supports:
//  * - Single video download
//  * - Playlist download (sequential)
//  *
//  * @param {Object} req - Express request object
//  * @param {Object} res - Express response object
//  */
// const downloadVideo = async (req, res) => {
//     try {
//         // =========================
//         // Input validation
//         // =========================
//         const { outputPath, infoId, formatId } = req.body;

//         if (!outputPath || !infoId || !formatId) {
//             return res.status(400).json({
//                 error: 'outputPath, infoId and formatId are required'
//             });
//         }

//         // Path to the yt-dlp JSON metadata
//         const infoPath = `./tmp/${infoId}.json`;

//         if (!fs.existsSync(infoPath)) {
//             return res.status(404).json({
//                 error: 'Info JSON not found'
//             });
//         }

//         // Parse yt-dlp metadata
//         const info = JSON.parse(
//             fs.readFileSync(infoPath, 'utf-8')
//         );

//         /**
//          * =========================
//          * CASE: PLAYLIST
//          * =========================
//          */
//         if (info._type === 'playlist' && Array.isArray(info.entries)) {

//             // Respond immediately to the client
//             // (downloads continue in the background)
//             res.json({
//                 message: 'Playlist download started',
//                 count: info.entries.length
//             });

//             // Sequential download to avoid rate limits or bans
//             for (const entry of info.entries) {

//                 // Generate a filesystem-safe title
//                 const safeTitle = sanitize(
//                     entry.title || entry.id
//                 );

//                 // Final output path
//                 const outputFile = path.join(
//                     outputPath,
//                     `${safeTitle}.%(ext)s`
//                 );

//                 // Actual YouTube video URL (NOT the JSON file)
//                 const videoUrl =
//                     `https://www.youtube.com/watch?v=${entry.id}`;

//                 await downloadWithProgress(
//                     videoUrl,
//                     {
//                         format: formatId,
//                         output: outputFile,
//                         noPlaylist: true
//                     }
//                 );
//             }

//             return;
//         }

//         /**
//          * =========================
//          * CASE: SINGLE VIDEO
//          * =========================
//          */
//         const safeTitle = sanitize(info.title);

//         const outputFile = path.join(
//             outputPath,
//             `${safeTitle}.%(ext)s`
//         );

//         // Respond immediately to the client
//         res.json({
//             message: 'Video download started',
//             path: outputFile
//         });

//         // For single videos, the JSON file can be used directly
//         await downloadWithProgress(
//             infoPath,
//             {
//                 format: formatId,
//                 output: outputFile,
//                 noPlaylist: true
//             }
//         );

//     } catch (err) {
//         console.error(err);

//         // Generic error handling
//         res.status(500).json({
//             error: err.message
//         });
//     }
// };

// // Export controller
// module.exports = { downloadVideo };



const youtubedl = require('youtube-dl-exec');

const streamVideo = async (req, res) => {
    const { url, formatId } = req.query;

    if (!url || !formatId) {
        return res.status(400).json({ error: 'url and formatId are required' });
    }

    // Headers para forzar descarga en el navegador
    res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
    res.setHeader('Content-Type', 'video/mp4');

    const subprocess = youtubedl.exec(url, {
        format: formatId,
        output: '-',       // <-- STREAM
        noPlaylist: true,
        jsRuntimes: 'node'
    });

    // Video → cliente
    subprocess.stdout.pipe(res);

    // Errores visibles
    subprocess.stderr.on('data', data => {
        console.error(data.toString());
    });

    // Si el cliente cancela
    req.on('close', () => {
        subprocess.kill('SIGKILL');
    });
};

module.exports = { streamVideo };
