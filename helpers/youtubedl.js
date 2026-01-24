const youtubedl = require('youtube-dl-exec')

const getInfo = (url, flags = {}) => {
    return youtubedl(url, {
        dumpSingleJson: true,
        ...flags
    })
}

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
