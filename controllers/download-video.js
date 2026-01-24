
const path = require("path");

const { fromInfo } = require('../helpers/youtubedl')
const downloadVideo = async (req, res) => {

    const { outputPath, filename, infoId, formatId} = req.body;

    const finalName = filename || `video_${Date.now()}.mp4`;
    const downloadUserPath = path.join(outputPath, finalName);


    await fromInfo( `./tmp/${infoId}.json` , {
        format: `${formatId}`,
        output: `${downloadUserPath}`
    })
    console.log('descargando video ')
    res.json({ messege: "download video funcionando" });
}



module.exports = {

    downloadVideo

}