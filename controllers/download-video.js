
const path = require("path");
const { downloadWithProgress } = require("../helpers/progress-bar");

const { error } = require("console");

/**
 * Express route handler to download a YouTube video.
 *
 * Expects the request body to contain:
 * - `outputPath`: The directory where the video will be saved.
 * - `filename`: Optional custom filename for the video.
 * - `infoId`: The ID of the JSON file with video info (from previous steps).
 * - `formatId`: The format code for the video download.
 *
 * Sends a fast JSON response to the client confirming the download started,
 * then starts downloading the video with progress logged to the console.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} - Resolves when downloadWithProgress finishes.
 *
 * @example
 * POST /download-video
 * {
 *   "outputPath": "./downloads",
 *   "filename": "myvideo.mp4",
 *   "infoId": "abc123",
 *   "formatId": "22"
 * }
 */

const downloadVideo = async (req, res) => { //TODO documentar bien esta funcion

    const { outputPath, filename, infoId, formatId, socketId } = req.body;



    // Get Socket
    const socket = req.io.sockets.sockets.get(socketId);



    // socket Exists?
    if(!socket){
        return res.status(400).json({
            error: 'Socket not connected'
        })
    }






beta-v1
    // Final Path
    const finalName = filename || `video_${Date.now()}.mp4`;
    const downloadUserPath = path.join(outputPath, finalName);


    // Fast answer
    res.json({ messege: "download video funcionando" });

    



    

    
    // Start download and progress-bar
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