const { getInfo, fromInfo } = require('../helpers/youtubedl')
const fs = require('fs')


const infoVideo = async(req, res) => {

    let url = req.url;
    // let url = 'https://youtu.be/z0hWGUfxbbg?si=z-W7Tv9ttfi-DG52'


    

    


    // with this function we get a YtResponse with all the info about the video
    // this info can be read and used and then passed again to youtube-dl, without having to query it again
    const info = await getInfo(url)

    // write the info to a file for youtube-dl to read it
    fs.writeFileSync('./videoInfo.json', JSON.stringify(info))
    

    // the info the we retrive can be read directly or passed to youtube-dl
    
    

    
    
    res.json({
        title: info.title,
        duration: info.duration,
        formats: info.formats.length
    })
}


module.exports = {
    infoVideo
}