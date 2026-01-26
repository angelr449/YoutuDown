


/**
 * Middleware to validate that a request contains a valid YouTube URL.
 *
 * Checks:
 * 1. The 'url' field exists in the request body.
 * 2. The URL has a valid format.
 * 3. The URL hostname is one of the allowed YouTube domains.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function.
 * @returns {import('express').Response|undefined} - Returns a 400 response with an error message if invalid; otherwise calls next().
 */
const validateYouTubeUrl = (req, res, next) =>{

     const { url } = req.query || {}; // <-- fallback


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