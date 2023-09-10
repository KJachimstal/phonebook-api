const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const uriDb = process.env.uriDb;
const PORT = process.env.PORT;

const connection = mongoose.connect(uriDb, { dbName: "phonebook" });

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Database connection successful`);
    });
  })
  .catch((err) =>
    console.log(`Database connection failed. Error message: ${err.message}`)
  );
