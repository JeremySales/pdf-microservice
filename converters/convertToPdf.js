const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

async function convertToPdf(buffer, originalname, mimetype) {
  const ext = path.extname(originalname).toLowerCase();
  const tempId = uuidv4();
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `${tempId}${ext}`);
  const outputPath = path.join(tempDir, `${tempId}.pdf`);

  fs.writeFileSync(inputPath, buffer);

const {
  isOfficeFile,
  isImageFile,
  isPdfFile,
  isSupportedFile
} = require('../utils/fileTypeHelper');

  try {
    if (isPdfFile(originalname)) {
  return buffer;
    } else if (isOfficeFile(originalname)) {
    await convertOfficeToPdf(inputPath, outputPath);
    return fs.readFileSync(outputPath);
    } else if (isImageFile(originalname)) {
    return await sharp(buffer).pdf().toBuffer();
    } else {
    throw new Error(`Unsupported file type: ${ext}`);
    }
  } finally {
    // Cleanup temp files
    [inputPath, outputPath].forEach(p => {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });
  }
}

function convertOfficeToPdf(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const libre = spawn('libreoffice', [
      '--headless',
      '--convert-to', 'pdf',
      '--outdir', path.dirname(outputPath),
      inputPath
    ]);

    libre.on('exit', (code) => {
      if (code === 0 && fs.existsSync(outputPath)) {
        resolve();
      } else {
        reject(new Error(`LibreOffice conversion failed with code ${code}`));
      }
    });

    libre.on('error', reject);
  });
}

module.exports = convertToPdf;
