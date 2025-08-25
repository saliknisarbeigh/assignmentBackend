const express = require("express");
const app = express();
const connectDb = require("./config/dataBase");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestsRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
