
const path = require("path");

const { fromInfo, getInfo } = require('../helpers/youtubedl');
const { downloadWithProgress } = require("../helpers/progress-bar");
const downloadVideo = async (req, res) => {

    const { outputPath, filename, infoId, formatId } = req.body;

    const finalName = filename || `video_${Date.now()}.mp4`;
    const downloadUserPath = path.join(outputPath, finalName);


    await fromInfo(`./tmp/${infoId}.json`, {
        format: `${formatId}`,
        output: `${downloadUserPath}`
    });

    await downloadWithProgress(`./tmp/${infoId}.json`, {
        format: formatId,
        output: downloadUserPath
    });


    res.json({ messege: "download video funcionando" });
}



module.exports = {

    downloadVideo

}