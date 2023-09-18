const multer = require("multer");
const path = require("path");
const uploadDir = path.join(process.cwd(), "uploads");
const storeImage = path.join(process.cwd(), "images");

const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const uploadedImage = multer({
  storage: storageImage,
});

module.exports = {
  storageImage,
  uploadedImage,
  storeImage,
  uploadDir,
};
