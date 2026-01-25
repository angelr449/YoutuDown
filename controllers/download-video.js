
const path = require("path");


const { downloadWithProgress } = require("../helpers/progress-bar");

const downloadVideo = async (req, res) => {

    const { outputPath, filename, infoId, formatId} = req.body;



    



    
    

    // Final Path
    const finalName = filename || `video_${Date.now()}.mp4`;
    const downloadUserPath = path.join(outputPath, finalName);


    // Fast answer
    res.json({ messege: "download video funcionando" });

    



    // await fromInfo(`./tmp/${infoId}.json`, {
    //     format: `${formatId}`,
    //     output: `${downloadUserPath}`
    // });

    // Init download and progress-bar

    await downloadWithProgress(`./tmp/${infoId}.json`, {
        format: `${formatId}`,
        output: `${downloadUserPath}`
    });


    
}



module.exports = {

    downloadVideo

}