const { Router } = require('express');
const { check } = require('express-validator');
const { infoVideo } = require('../controllers');
const { downloadVideo } = require('../controllers/download-video');
const { validateYouTubeUrl } = require('../middlewares');
const { requestValidation } = require('../middlewares/requestValidation');

const router = Router();

router.post('/info', [
    check('url', 'URL is required').not().isEmpty(),
    validateYouTubeUrl,
    requestValidation,

],infoVideo);


router.get('/download', downloadVideo);

module.exports = router;