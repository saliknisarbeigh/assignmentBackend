const express = require("express");
const app = express();
const connectDb = require("./config/dataBase");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("./utils/validation");
const validator = require("validator");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const jwt = require("jsonwebtoken");
app.post("/signup", async (req, res) => {
  // validate data
  validateSignUpData(req);
  const {
    password,
    firstName,
    lastName,
    emailId,
    skills,
    age,
    gender,
    photoUrl,
    about,
  } = req.body;
  const userAlreadyPresent = await User.findOne({ emailId: emailId });
  if (userAlreadyPresent) {
    return res.status(409).send("User with the same emailId  already exists.");
  }

  // hash password
  const passwordHash = await bcrypt.hash(password, 10);
  // console.log(passwordHash);
  //  creating a new instance of new User model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
    skills,
    age,
    gender,
    photoUrl,
    about,
  });
  try {
    await user.save();
    res.status(201).send("User created successfully.");
  } catch (err) {
    res.status(400).send("Signup failed: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (validator.isEmail(emailId)) {
      const user = await User.findOne({ emailId: emailId });

      if (!user) {
        throw new Error("Login failed: Invalid credentials.");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = await jwt.sign({ _id: user._id }, "pulse@511");
        // console.log(token);
        res.cookie("token", token);

        res.status(200).send("Login successful.");
      } else {
        throw new Error("Login failed: Password is incorrect.");
      }
    }
  } catch (err) {
    res.status(401).send("Login failed: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("invalid token");
    }
    // validate token

    const decodedMessage = await jwt.verify(token, "pulse@511");
    // console.log(decodedMessage);
    const { _id } = decodedMessage;
    console.log("Logged in  user is : " + _id);
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user doesn't exist");
    }

    res.send(user);
    // console.log(token);
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});

app.post("/getUserDetails", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userById = await User.findById(userId);

    if (!userById) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send(userById);
  } catch (err) {
    res.status(500).send("Failed to get user details: " + err.message);
  }
});

app.use("/user", async (req, res) => {
  const userEmailId = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmailId });

    if (user.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send("Failed to get user: " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const userEmailId = req.body.emailId;
    const user = await User.find({ emailId: userEmailId });

    if (user.length === 0) {
      res.status(404).send("User not found.");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send("Failed to get feed: " + err.message);
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const userId = "68a2c18035a827cf3d78146d";

    const user = await User.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully.");
    // console.log(user);
  } catch (err) {
    res.status(500).send("Delete failed: " + err.message);
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
      throw new Error(
        "Update not allowed: One or more fields are not permitted."
      );
    }
    // if (data?.skills.length > 10) {
    //   throw new Error("Update not allowed: Skills cannot be more than 10.");
    // }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).send("User updated successfully.");
    // console.log(user);
  } catch (err) {
    res.status(500).send("Update failed: " + err.message);
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
