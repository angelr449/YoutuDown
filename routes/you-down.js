const { Router } = require('express');
const { check } = require('express-validator');
const { infoVideo } = require('../controllers');
const { downloadVideo } = require('../controllers/download-video');

const router = Router();

router.get('/info', infoVideo);


router.get('/download', downloadVideo);

module.exports = router;