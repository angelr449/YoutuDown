const fs = require('fs')
const { getInfo} = require('../helpers/youtubedl')



const infoVideo = async (req, res) => {
    const { url } = req.query;




    try {
        // with this function we get a YtResponse with all the info about the video
        // this info can be read and used and then passed again to youtube-dl, without having to query it again
        const info = await getInfo(url)
        const infoId = crypto.randomUUID();
        const infoPath = `./tmp/${infoId}.json`;


        // write the info to a file for youtube-dl to read it
        await fs.writeFileSync(infoPath, JSON.stringify(info, null, 2))


        // the info the we retrive can be read directly or passed to youtube-dl


        // Fomats Map

        mplifiedFormats = info.formats
            .filter(f => f.ext === 'mp4')
            .map(f => ({
                id: f.format_id,
                resolution: f.format_note || `${f.height || 0}p`,
                hasAudio: f.acodec !== 'none',
                hasVideo: f.vcodec !== 'none'
            }));






        res.json({
            infoId,
            title: info.title,
            duration: info.duration,
            formats: simplifiedFormats
        })
    } catch (err) {

        res.status(500).json({ error: err.message });

    }





}


module.exports = {
    infoVideo
}