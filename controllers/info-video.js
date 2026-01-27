const fs = require('fs');
const crypto = require('crypto');
const { getInfo } = require('../helpers/youtubedl');

/**
 * simplifyFormats
 * ----------------
 * Reduces yt-dlp raw format objects into a clean, predictable structure.
 *
 * Background:
 * yt-dlp returns dozens (sometimes hundreds) of formats per video.
 * Most of them are redundant, incomplete, or irrelevant for a UI.
 *
 * This function:
 * - Filters out unusable formats
 * - Keeps only formats with a valid URL
 * - Detects audio-only vs video formats
 * - Normalizes quality and resolution fields
 * - Sorts formats by usefulness (best first)
 *
 * Design goal:
 * Provide frontend-friendly data without exposing yt-dlp internals.
 *
 * @param {Array<Object>} formats - Raw formats array from yt-dlp
 * @returns {Array<Object>} Simplified and sorted formats
 */
const simplifyFormats = (formats = []) => {
    // Defensive programming: yt-dlp should return an array, but never trust input
    if (!Array.isArray(formats)) return [];

    return formats
        /**
         * Keep only formats that actually have a downloadable source.
         * Some formats only describe manifests or metadata.
         */
        .filter(f => f.url || f.manifest_url)

        /**
         * Keep formats that:
         * - Have a valid resolution (video)
         * - OR are audio-only formats
         */
        .filter(f => {
            const hasValidResolution = f.height > 0 || f.format_note;
            const isAudioOnly = f.acodec !== 'none' && f.vcodec === 'none';
            return hasValidResolution || isAudioOnly;
        })

        /**
         * Normalize each format into a compact object
         */
        .map(f => {
            let quality = 'Unknown';

            /**
             * yt-dlp provides multiple ways to describe quality.
             * We prioritize human-readable labels when available.
             */
            if (f.format_note) {
                quality = f.format_note;
            } else if (f.height) {
                quality = `${f.height}p`;
            } else if (f.acodec !== 'none' && f.vcodec === 'none') {
                quality = 'Audio Only';
            }

            return {
                id: f.format_id,
                quality,
                resolution: quality, // Backward compatibility with older frontend
                hasAudio: f.acodec !== 'none',
                hasVideo: f.vcodec !== 'none',
                ext: f.ext || 'mp4',
                filesize: f.filesize || f.filesize_approx,
                fps: f.fps,
                width: f.width,
                height: f.height
            };
        })

        /**
         * Sorting strategy:
         * 1) Prefer formats that include both audio and video
         * 2) Then sort by resolution (descending)
         */
        .sort((a, b) => {
            const aFull = a.hasAudio && a.hasVideo;
            const bFull = b.hasAudio && b.hasVideo;

            if (aFull && !bFull) return -1;
            if (!aFull && bFull) return 1;

            return (b.height || 0) - (a.height || 0);
        });
};

/**
 * infoVideo
 * ----------
 * Express route handler that retrieves metadata for:
 * - A single YouTube video
 * - OR a YouTube playlist
 *
 * Important behavior difference:
 *
 * SINGLE VIDEO:
 * - yt-dlp already returns full format information
 * - One yt-dlp call is sufficient
 *
 * PLAYLIST:
 * - yt-dlp returns only lightweight metadata for each entry
 * - Format information is NOT included
 * - Each video must be queried individually
 *
 * This is slower, but guarantees accurate formats.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const infoVideo = async (req, res) => {
    const { url } = req.query;

    /**
     * Basic input validation
     */
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        /**
         * First yt-dlp execution.
         * Depending on the URL, this may return:
         * - A video object
         * - A playlist object with entries
         */
        const info = await getInfo(url);

        /**
         * Persist raw yt-dlp output to disk.
         *
         * Why this exists:
         * - Avoid re-running yt-dlp for downloads
         * - Debugging and auditing
         * - Traceability between requests
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
         * yt-dlp does NOT include formats at playlist level.
         * Each entry must be resolved individually.
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
         * Formats are already present in the initial yt-dlp response.
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
         *
         * Common causes:
         * - Invalid YouTube URLs
         * - yt-dlp execution errors
         * - Network or timeout issues
         */
        return res.status(500).json({
            error: 'Failed to retrieve video information',
            details: err.message
        });
    }
};

module.exports = { infoVideo };
