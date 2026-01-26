// =========================
// External dependencies
// =========================
const youtubedl = require('youtube-dl-exec');
// Node.js wrapper for yt-dlp / youtube-dl

/**
 * Executes yt-dlp and prints download progress to the console.
 *
 * Accepts either:
 * - A direct video URL
 * - A path to a previously generated yt-dlp JSON info file
 *
 * @param {string} input - Video URL or path to info JSON
 * @param {Object} options - yt-dlp execution options
 * @returns {ChildProcess} yt-dlp subprocess
 */
const downloadWithProgress = async (input, options = {}) => {

    // Detect whether input is a URL or a local JSON file
    const isUrl = /^https?:\/\//.test(input);

    // Spawn yt-dlp subprocess
    const subprocess = isUrl
        ? youtubedl.exec(input, {
            jsRuntimes: 'node', // Forces yt-dlp to use Node runtime
            ...options
        })
        : youtubedl.exec('', {
            loadInfoJson: input, // Load metadata from JSON instead of fetching
            jsRuntimes: 'node',
            ...options
        });

    // =========================
    // STDOUT: progress output
    // =========================
    subprocess.stdout.on('data', data => {
        const output = data.toString();

        // Filter and print only download progress lines
        if (output.includes('[download]')) {
            console.log(output.trim());
        }
    });

    // =========================
    // STDERR: errors and warnings
    // =========================
    subprocess.stderr.on('data', data => {
        console.error(data.toString().trim());
    });

    return subprocess;
};

module.exports = { downloadWithProgress };
