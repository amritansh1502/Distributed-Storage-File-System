const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { handleFileUpload } = require('../controllers/uploadController.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), handleFileUpload);

module.exports = router;
