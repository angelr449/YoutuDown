// =========================
// Core Node.js modules
// =========================
const fs = require('fs');          // File system: read and validate files
const path = require('path');      // Safe, cross-platform path handling

// =========================
// Custom helpers
// =========================
const { downloadWithProgress } = require('../helpers/progress-bar');
// Helper that executes yt-dlp and reports download progress in real time

/**
 * Sanitizes a file name to make it safe for the filesystem.
 * Removes invalid characters and trims extra whitespace.
 *
 * Why this exists:
 * - Prevents filesystem errors
 * - Avoids OS-specific invalid characters
 *
 * @param {string} name
 *   Original file name.
 *
 * @returns {string}
 *   Sanitized, filesystem-safe file name.
 */
const sanitize = (name) =>
    name.replace(/[<>:"/\\|?*]/g, '').trim();

/**
 * HTTP controller responsible for downloading videos or playlists
 * using previously generated yt-dlp metadata JSON files.
 *
 * Supported cases:
 * - Single video download
 * - Playlist download (processed sequentially)
 *
 * Design notes:
 * - Metadata extraction and downloading are intentionally separated
 * - Playlist downloads are sequential to avoid rate limits or bans
 * - The HTTP response is sent immediately; downloads continue asynchronously
 *
 * @param {Object} req
 *   Express request object.
 *
 * @param {Object} res
 *   Express response object.
 */
const downloadVideo = async (req, res) => {
    try {
        // =========================
        // Input validation
        // =========================
        const { outputPath, infoId, formatId } = req.body;

        if (!outputPath || !infoId || !formatId) {
            return res.status(400).json({
                error: 'outputPath, infoId and formatId are required'
            });
        }

        // Path to the yt-dlp metadata JSON file
        const infoPath = `./tmp/${infoId}.json`;

        if (!fs.existsSync(infoPath)) {
            return res.status(404).json({
                error: 'Info JSON not found'
            });
        }

        // Load and parse yt-dlp metadata
        const info = JSON.parse(
            fs.readFileSync(infoPath, 'utf-8')
        );

        /**
         * =========================
         * CASE: PLAYLIST DOWNLOAD
         * =========================
         */
        if (info._type === 'playlist' && Array.isArray(info.entries)) {

            // Respond immediately to the client
            // Downloads continue in the background
            res.json({
                message: 'Playlist download started',
                count: info.entries.length
            });

            // Sequential processing to minimize detection and rate limiting
            for (const entry of info.entries) {

                // Generate a filesystem-safe title
                const safeTitle = sanitize(
                    entry.title || entry.id
                );

                // Final output path template
                const outputFile = path.join(
                    outputPath,
                    `${safeTitle}.%(ext)s`
                );

                // Actual YouTube video URL (not the metadata JSON)
                const videoUrl =
                    `https://www.youtube.com/watch?v=${entry.id}`;

                await downloadWithProgress(
                    videoUrl,
                    {
                        format: formatId,
                        output: outputFile,
                        noPlaylist: true
                    }
                );
            }

            return;
        }

        /**
         * =========================
         * CASE: SINGLE VIDEO DOWNLOAD
         * =========================
         */
        const safeTitle = sanitize(info.title);

        const outputFile = path.join(
            outputPath,
            `${safeTitle}.%(ext)s`
        );

        // Respond immediately to the client
        res.json({
            message: 'Video download started',
            path: outputFile
        });

        // For single videos, yt-dlp can consume the metadata JSON directly
        await downloadWithProgress(
            infoPath,
            {
                format: formatId,
                output: outputFile,
                noPlaylist: true
            }
        );

    } catch (err) {
        console.error(err);

        // Generic error handling
        res.status(500).json({
            error: err.message
        });
    }
};

// Export controller
module.exports = { downloadVideo };
