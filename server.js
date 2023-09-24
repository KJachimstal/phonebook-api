const app = require("./app");
const fs = require("fs").promises;
const mongoose = require("mongoose");
const { uploadDir, storeImage } = require("./api/config/multer");
require("dotenv").config();

const uriDb = process.env.uriDb;
const PORT = process.env.PORT;

const connection = mongoose.connect(uriDb, { dbName: "phonebook" });

const isFolderAvaliable = (path) => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isFolderAvaliable(folder))) {
    await fs.mkdir(folder);
  }
};

connection
  .then(() => {
    app.listen(PORT, () => {
      createFolderIsNotExist(uploadDir);
      createFolderIsNotExist(storeImage);
      return console.log(`Database connection successful`);
    });
  })
  .catch((err) =>
    console.log(`Database connection failed. Error message: ${err.message}`)
  );
