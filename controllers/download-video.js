
const path = require("path");

const { fromInfo } = require('../helpers/youtubedl')
const downloadVideo = async (req, res) => {

    const { outputPath, filename } = req.body;

    const finalName = filename || `video_${Date.now()}.mp4`;
    const downloadUserPath = path.join(outputPath, finalName);


    await fromInfo('./videoInfo.json', {
        format: '18',
        output: `${downloadUserPath}`
    })
    console.log('descargando video ')
    res.json({ messege: "download video funcionando" });
}



module.exports = {

    downloadVideo

}