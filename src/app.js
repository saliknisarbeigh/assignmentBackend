const express = require("express");
const app = express();
const connectDb = require("./config/dataBase");

connectDb()
  .then(() => {
    console.log(" dataBase connection successful");
    app.listen(3000, () => {
      console.log("server successfully running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err, "failed");
  });
//  mongoose doc
// schemas doc
