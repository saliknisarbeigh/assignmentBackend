const express = require("express");
const app = express();

//  req handler
app.use((req, res) => {
  if (req.url === "/hello") {
    res.send("asad malla asad noob");
  } else {
    res.send("asad malla");
  }
});

app.listen(3000, () => {
  console.log("waiting for you at port 3000...");
});
