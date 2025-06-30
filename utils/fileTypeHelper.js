const path = require('path');

const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tif', '.tiff'];
const pdfExtension = ['.pdf'];

function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

function isOfficeFile(filename) {
  return officeExtensions.includes(getFileExtension(filename));
}

function isImageFile(filename) {
  return imageExtensions.includes(getFileExtension(filename));
}

function isPdfFile(filename) {
  return pdfExtension.includes(getFileExtension(filename));
}

function isSupportedFile(filename) {
  return (
    isOfficeFile(filename) ||
    isImageFile(filename) ||
    isPdfFile(filename)
  );
}

module.exports = {
  isOfficeFile,
  isImageFile,
  isPdfFile,
  isSupportedFile,
};
