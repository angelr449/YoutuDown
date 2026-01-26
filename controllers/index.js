const downloadVideo = require('./download-video');
const streamDownload = require('./stream-download');
const infoVideo = require('./info-video');


module.exports ={
    ...downloadVideo,
    ...streamDownload,
    ...infoVideo
}