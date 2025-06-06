const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

router.get('/download/:fileId', downloadController.handleFileDownload);

module.exports = router;
