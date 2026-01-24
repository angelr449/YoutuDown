const downloadVideo = require('./download-video');
const infoVideo = require('./info-video');

module.exports ={
    ...downloadVideo,
    ...infoVideo
}