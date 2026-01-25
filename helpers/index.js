const { downloadWithProgress } = require("./progress-bar");
const { getInfo, fromInfo } = require("./youtubedl");

module.exports= {
    ...downloadWithProgress,
    ...fromInfo,
    ...getInfo
}

