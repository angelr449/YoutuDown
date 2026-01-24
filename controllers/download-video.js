const { fromInfo } = require('../helpers/youtubedl')
const  downloadVideo = async(req, res) => {
    res.json({ messege: "download video funcionando" });

    
    await fromInfo('./videoInfo.json', {
        format: '18',
        output: 'path/to/outputs'
    })
    console.log('descargando video ')
}



module.exports = {

    downloadVideo

}