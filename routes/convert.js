const express = require('express');
const router = express.Router();
const convertToPdf = require('../converters/convertToPdf');

router.post('/', async (req, res) => {
  try {
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
