const express = require("express");
const app = express();
const connectDb = require("./config/dataBase");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
app.use(express.json());

app.post("/signup", async (req, res) => {
  validateSignUpData(req);
  const { password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);

  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/getUserDetails", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userById = await User.findById(userId);

    if (!userById) {
      return res.status(404).send("User not found");
    }

    res.send(userById);
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

app.use("/user", async (req, res) => {
  const userEmailId = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmailId });

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
    const userEmailId = req.body.emailId;
    const user = await User.find({ emailId: userEmailId });

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

app.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
      "password",
      "firstName",
      "lastName",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("skills cannot be more then 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("update successfully");
    console.log(user);
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
