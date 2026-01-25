const youtubedl = require('youtube-dl-exec');

const downloadWithProgress = async (infoPath, options, onProgress) => {
    const subprocess = youtubedl.exec('', {
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