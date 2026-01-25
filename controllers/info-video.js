const fs = require('fs');
const crypto = require('crypto');
const { getInfo } = require('../helpers/youtubedl');

/**
 * Express route handler to retrieve and store YouTube video information.
 *
 * Steps:
 * 1. Retrieves video info from YouTube using `getInfo`.
 * 2. Generates a unique ID for the info and stores it in a JSON file in ./tmp.
 * 3. Simplifies available video formats (mp4) for easier selection later.
 * 4. Returns JSON with `infoId`, `title`, `duration`, and simplified formats.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} - Resolves when response is sent.
 *
 * @example
 * GET /info-video?url=https://www.youtube.com/watch?v=abc123
 * Response:
 * {
 *   "infoId": "uuid-generated-id",
 *   "title": "Video Title",
 *   "duration": 123,
 *   "formats": [
 *     { "id": "22", "resolution": "720p", "hasAudio": true, "hasVideo": true }
 *   ]
 * }
 */


const infoVideo = async (req, res) => {
    const { url } = req.query;




    try {
        // with this function we get a YtResponse with all the info about the video
        // this info can be read and used and then passed again to youtube-dl, without having to query it again
        const info = await getInfo(url)
        const infoId = crypto.randomUUID();
        const infoPath = `./tmp/${infoId}.json`;
        const formats = Array.isArray(info.formats) ? info.formats : [];


        // write the info to a file for youtube-dl to read it
        await fs.writeFileSync(infoPath, JSON.stringify(info, null, 2))


        // the info the we retrive can be read directly or passed to youtube-dl

        if (Array.isArray(info.entries)) {
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



        // Simply formats

        mplifiedFormats = info.formats
            .filter(f => f.ext === 'mp4')
            .map(f => ({
                id: f.format_id,
                resolution: f.format_note || `${f.height || 0}p`,
                hasAudio: f.acodec !== 'none',
                hasVideo: f.vcodec !== 'none'
            }));






        res.json({
            infoId,
            title: info.title,
            duration: info.duration,
            formats: mplifiedFormats
        })
    } catch (err) {

        res.status(500).json({ error: err.message });

    }





};


module.exports = {
    infoVideo
};