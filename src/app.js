const express = require("express");
const app = express();
app.use(
  "/user",
  (req, res, next) => {
    next();
    res.send("hey im the first router handler");
  },
  (req, res) => {
    res.send("hey im the second route handler");
  }
);

app.listen(7777, () => {
  console.log("server created successfully");
});
