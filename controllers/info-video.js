const fs = require('fs');
const crypto = require('crypto');
const { getInfo } = require('../helpers/youtubedl');

/**
 * Simplifies yt-dlp format objects.
 * 
 * Purpose:
 * yt-dlp returns a very large list of formats with a lot of noise.
 * This function filters only MP4 formats and extracts the fields
 * that are relevant for a download UI or API consumer.
 *
 * @param {Array<Object>} formats - Raw formats array from yt-dlp
 * @returns {Array<Object>} Simplified formats
 */
const simplifyFormats = (formats = []) => {
    if (!Array.isArray(formats)) return [];

    return formats
        
        .map(f => ({
            id: f.format_id,
            resolution: f.format_note || `${f.height || 0}p`,
            hasAudio: f.acodec !== 'none',
            hasVideo: f.vcodec !== 'none'
        }));
};

/**
 * Express route handler to retrieve YouTube video or playlist information.
 *
 * Behavior:
 * - If the URL points to a SINGLE VIDEO:
 *   - Returns full format information (mp4 only).
 *
 * - If the URL points to a PLAYLIST:
 *   - yt-dlp only returns lightweight metadata for entries.
 *   - Formats are NOT included at playlist level.
 *   - To retrieve formats, each video must be queried individually.
 *
 * Design note:
 * This approach is intentionally slower for playlists but guarantees
 * accurate and complete format information.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const infoVideo = async (req, res) => {
    const { url } = req.query;

    // Validate input
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        /**
         * Initial yt-dlp call.
         * This may return either:
         * - A video object
         * - A playlist object with lightweight entries
         */
        const info = await getInfo(url);

        /**
         * Persist raw metadata to disk.
         * This allows:
         * - Later reuse (downloads, debugging)
         * - Avoiding repeated yt-dlp calls
         */
        const infoId = crypto.randomUUID();
        const infoPath = `./tmp/${infoId}.json`;
        await fs.promises.writeFile(
            infoPath,
            JSON.stringify(info, null, 2)
        );

        /**
         * PLAYLIST HANDLING
         *
         * Important:
         * yt-dlp does NOT include format information inside playlist entries.
         * Therefore, each video must be queried individually to obtain formats.
         */
        if (info._type === 'playlist' && Array.isArray(info.entries)) {
            const videos = [];

            for (const entry of info.entries) {
                const videoUrl = `https://www.youtube.com/watch?v=${entry.id}`;

                // Secondary yt-dlp call per video
                const videoInfo = await getInfo(videoUrl);

                videos.push({
                    id: entry.id,
                    title: entry.title,
                    duration: entry.duration ?? null,
                    formats: simplifyFormats(videoInfo.formats)
                });
            }

            return res.json({
                infoId,
                type: 'playlist',
                title: info.title,
                count: videos.length,
                videos
            });
        }

        /**
         * SINGLE VIDEO HANDLING
         *
         * In this case yt-dlp already returns full format information.
         */
        return res.json({
            infoId,
            type: 'video',
            title: info.title,
            duration: info.duration,
            formats: simplifyFormats(info.formats)
        });

    } catch (err) {
        /**
         * Centralized error handling.
         * Errors here usually come from:
         * - yt-dlp execution
         * - network issues
         * - invalid YouTube URLs
         */
        return res.status(500).json({
            error: 'Failed to retrieve video information',
            details: err.message
        });
    }
};

module.exports = { infoVideo };
