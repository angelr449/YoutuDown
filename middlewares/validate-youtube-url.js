

const validateYouTubeUrl = (req, res, next) =>{

    const {url} = req.body;


    // 1. Exists

    if(!url){
        return res.status(400).json({
            error: 'URL is required'
        });
    }

    let parseUrl;

    try {
        parseUrl = new URL(url);
        
    } catch (error) {

        return res.status(400).json({
            error: 'Invalid URL format'
        });
        
    }

    // 2. Allowed YouTube hosts
    const allowedHosts = [
        'www.youtube.com',
        'youtube.com',
        'youtu.be'
    ];

    if(!allowedHosts.includes(parseUrl.hostname)){
        return res.status(400).json({
            error: 'URL must be a YouTube link'
        });
    }


    next();


}


module.exports = {

    validateYouTubeUrl
}