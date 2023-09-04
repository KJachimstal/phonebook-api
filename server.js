const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const uriDb = process.env.uriDb;
const PORT = process.env.PORT;

const connection = mongoose.connect(uriDb);

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
