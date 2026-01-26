const { Router } = require('express');
const { check, query } = require('express-validator');
const { infoVideo } = require('../controllers');
const { downloadVideo, streamVideo } = require('../controllers/download-video');
const { validateYouTubeUrl } = require('../middlewares');
const { requestValidation } = require('../middlewares/requestValidation');

const router = Router();


// Route to get information about the video
router.get('/info', [
    query('url', 'URL is required').not().isEmpty(),
    validateYouTubeUrl,
    requestValidation,

],infoVideo);

// Route to init the download
router.get('/download', [
    // check('outputPath', 'outputPath is required').not().isEmpty(),
    // check('infoId', 'infoId is required').not().isEmpty(),
    // check('formatId', 'formatId is required').not().isEmpty(),
    requestValidation],
    streamVideo);

module.exports = router;