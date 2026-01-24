const { Router } = require('express');
const { check, query } = require('express-validator');
const { infoVideo } = require('../controllers');
const { downloadVideo } = require('../controllers/download-video');
const { validateYouTubeUrl } = require('../middlewares');
const { requestValidation } = require('../middlewares/requestValidation');

const router = Router();

router.get('/info', [
    query('url', 'URL is required').not().isEmpty(),
    validateYouTubeUrl,
    requestValidation,

],infoVideo);


router.post('/download', downloadVideo);

module.exports = router;