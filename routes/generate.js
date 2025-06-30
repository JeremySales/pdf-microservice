const express = require('express');
const multer = require('multer');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: '/tmp' }); // or use 'uploads/' if preferred

router.post('/', upload.single('file'), async (req, res) => {

    console.log('🟢 /generate-pdf route hit');
  try {
    const { file } = req;
    const fields = JSON.parse(req.body.fields);

    if (!file || !fields) {
      return res.status(400).json({ error: 'Missing file or fields' });
    }

    // Load the uploaded PDF
    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();

    for (const field of fields) {
      const pageIndex = field.page - 1;
      if (!pages[pageIndex]) continue;

      const page = pages[pageIndex];
      page.drawText(field.value, {
        x: field.x,
        y: field.y,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }

    const resultPdf = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(resultPdf));
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

module.exports = router;
