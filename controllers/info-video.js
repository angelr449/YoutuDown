const fs = require('fs');
const crypto = require('crypto');
const { getInfo } = require('../helpers/youtubedl');

/**
 * Express route handler to retrieve and store YouTube video or playlist information.
 *
 * This endpoint fetches metadata from a YouTube URL (video or playlist) using `yt-dlp`.
 * It saves the metadata to a JSON file for later use and returns simplified information
 * to the client, distinguishing between a single video and a playlist.
 *
 * Steps:
 * 1. Validates the URL query parameter.
 * 2. Retrieves video/playlist info via `getInfo`.
 * 3. Generates a unique info ID and saves the full info JSON to `./tmp`.
 * 4. Determines if the URL is a playlist or a single video.
 * 5. Simplifies video formats (mp4) for easier selection later.
 * 6. Returns JSON with the infoId, type, and relevant metadata.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} - Resolves after sending response
 *
 * @example
 * GET /info-video?url=https://www.youtube.com/watch?v=abc123
 * Response (video):
 * {
 *   "infoId": "uuid-generated-id",
 *   "type": "video",
 *   "title": "Video Title",
 *   "duration": 123,
 *   "formats": [
 *     { "id": "22", "resolution": "720p", "hasAudio": true, "hasVideo": true }
 *   ]
 * }
 *
 * Response (playlist):
 * {
 *   "infoId": "uuid-generated-id",
 *   "type": "playlist",
 *   "count": 5,
 *   "videos": [
 *     { "id": "abc123", "title": "Video 1", "duration": 120 },
 *     { "id": "def456", "title": "Video 2", "duration": 95 }
 *   ]
 * }
 */
const infoVideo = async (req, res) => {
    const { url } = req.query;

    // Validate input
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Fetch full metadata from YouTube
        const info = await getInfo(url);

        // Generate unique ID for metadata JSON file
        const infoId = crypto.randomUUID();
        const infoPath = `./tmp/${infoId}.json`;

        // Save metadata asynchronously to disk
        await fs.promises.writeFile(infoPath, JSON.stringify(info, null, 2));

        // Check if the result is a playlist
        if (info._type === 'playlist' && Array.isArray(info.entries)) {
            const videos = info.entries.map(video => ({
                id: video.id,
                title: video.title,
                duration: video.duration
            }));

            return res.json({
                infoId,
                type: 'playlist',
                count: videos.length,
                videos
            });
        }

        // Single video: simplify formats
        const simplifiedFormats = Array.isArray(info.formats)
            ? info.formats
                  .filter(f => f.ext === 'mp4')
                  .map(f => ({
                      id: f.format_id,
                      resolution: f.format_note || `${f.height || 0}p`,
                      hasAudio: f.acodec !== 'none',
                      hasVideo: f.vcodec !== 'none'
                  }))
            : [];

        // Return simplified video info
        res.json({
            infoId,
            type: 'video',
            title: info.title,
            duration: info.duration,
            formats: simplifiedFormats
        });

    } catch (err) {
        // Handle errors gracefully
        res.status(500).json({ error: err.message });
    }
};

module.exports = { infoVideo };
