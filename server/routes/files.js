const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

router.get('/files', downloadController.listFiles);

module.exports = router;
