
const path = require("path");

const { fromInfo, getInfo } = require('../helpers/youtubedl');
const { downloadWithProgress } = require("../helpers/progress-bar");
const { error } = require("console");
const downloadVideo = async (req, res) => {

    const { outputPath, filename, infoId, formatId, socketId } = req.body;



    // Get Socket
    const socket = req.io.sockets.sockets.get(socketId);



    // socket Exists?
    if(!socket){
        return res.status(400).json({
            error: 'Socket not connected'
        })
    }

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
    }, (progressLine)=>{
        socket.emit('progress-bar', progressLine);
    });


    
}



module.exports = {

    downloadVideo

}