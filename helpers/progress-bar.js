const youtubedl = require('youtube-dl-exec');


/**
 * Downloads a YouTube video using information from a JSON file and logs progress to the console.
 *
 * @param {string} infoPath - Path to the JSON file with YouTube video information.
 * @param {Object} [options={}] - Additional options to pass to youtube-dl-exec.
 * @returns {import('child_process').ChildProcess} - The child process running youtube-dl, allowing further event handling if needed.
 *
 * @example
 * const subprocess = downloadWithProgress('videoInfo.json', { output: 'video.mp4' });
 * subprocess.on('close', () => console.log('Download finished'));
 */
const downloadWithProgress = async (infoPath, options, onProgress) => {
    const subprocess = youtubedl.exec('', { //TODO poner en la documentacion a onProgress
        loadInfoJson: infoPath,
        ...options
    });

    subprocess.stdout.on('data', data => {
        const output = data.toString();


        if (output.includes('[download]')) {
            // Example:
            // [download]  42.3% of 10.23MiB at 1.23MiB/s ETA 00:04
            onProgress(output.trim());
        }
    });

    return subprocess;
};


module.exports = {
    downloadWithProgress
}