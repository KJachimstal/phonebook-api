const multer = require("multer");
const path = require("path");
const uploadDir = path.join(process.cwd(), "uploads");
const storeImage = path.join(process.cwd(), "public/avatars");
const uuid = require("uuid");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const randomFilename = uuid.v4();
    const newFileName =
      randomFilename + "." + file.originalname.split(".").pop();
    cb(null, newFileName);
  },
  limits: {
    fileSize: 1048576,
  },
});

const uploadedImage = multer({
  storage: imageStorage,
});

module.exports = {
  uploadedImage,
  storeImage,
  uploadDir,
};
