const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://salik:saliknisar@cluster0.rno0vjn.mongodb.net/DevTinder"
  );
};

module.exports = connectDb;
