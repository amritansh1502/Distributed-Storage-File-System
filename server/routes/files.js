const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const authMiddleware = require('../middleware/auth');

router.get('/files', authMiddleware, downloadController.listFiles);

module.exports = router;
