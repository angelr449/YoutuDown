const youtubedl = require('youtube-dl-exec') //library to download videos 

/**
 * Fetches information about a YouTube video or playlist.
 * @param {URL | string} url - The URL fo the YouTube video of playlist.
 * @param {Object} [flasg={}] - Optional flasg to pass to youtubedl. 
 * @returns {Promise<Object>} - A promise that resolves with the video.
 */
const getInfo = (url, flags = {}) => {
    return youtubedl(url, {
        dumpSingleJson: true,
        skipDownload: true,
        userAgent: 'Mozilla/5.0',
        retries: 5,
        socketTimeout: 30,
        ...flags
    })
}


/**
 * Loads YouTube video or playlist information from a JSON info file.
 *
 * @param {string} infoFile - Path to the JSON file containing video information.
 * @param {Object} [flags={}] - Optional flags to pass to youtubedl.exec.
 * @returns {Promise<Object>} - A promise that resolves with the video information loaded from the file.
 */
const fromInfo = (infoFile, flags = {}) => {
    return youtubedl.exec('', {
        loadInfoJson: infoFile,
        ...flags
    })
}


module.exports = {
    getInfo,
    fromInfo
}
