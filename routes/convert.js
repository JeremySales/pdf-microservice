const express = require('express');
const multer = require('multer');
const router = express.Router();
const convertToPdf = require('../converters/convertToPdf');

// Use memoryStorage if you want req.file.buffer
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, originalname, mimetype } = req.file;
    const pdfBuffer = await convertToPdf(buffer, originalname, mimetype);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Conversion error:', err);
    res.status(500).json({ error: 'Failed to convert file to PDF' });
  }
});

module.exports = router;
