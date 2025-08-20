const express = require("express");
const app = express();
const connectDb = require("./config/dataBase");
const User = require("./models/user");
const { ReturnDocument } = require("mongodb");
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);

  await user.save();
  res.send("user added");
});
app.use("/check", async (req, res) => {
  try {
    const userById = await User.findById("68a1b8541480f319a18fcf4d");
    res.send(userById);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
app.use("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ email: userEmail });

    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({ email: userEmail });

    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const userId = "68a2c18035a827cf3d78146d";

    const user = await User.findByIdAndDelete(userId);
    res.send("deleted successfully");
    console.log(user);
  } catch (err) {
    res.status(400).send("practice karle laadle");
  }
});

app.patch("/update", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("update successfully");
  } catch (err) {
    res.status(400).send("update failed: " + err.message);
  }
});
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
