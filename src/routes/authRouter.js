const express = require("express");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
authRouter.post("/signup", async (req, res) => {
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
  const userEmailAlreadyPresent = await User.findOne({ emailId: emailId });
  if (userEmailAlreadyPresent) {
    return res.status(409).send("User with the same emailId  already exists.");
  }
  const userNameAlreadyPresent = await User.findOne({ firstName: firstName });
  if (userNameAlreadyPresent) {
    return res.status(409).send("name is already taken ");
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
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (validator.isEmail(emailId)) {
      const user = await User.findOne({ emailId: emailId });

      if (!user) {
        throw new Error(" Invalid credentials.");
      }
      const isPasswordValid = await user.validatePassword(password); //offload  to mongo schema . UserSchema/userSchema methods  aka helper function will be good choice here/ reusable and clean
      // const isPasswordValid = await bcrypt.compare(password, user.password); //
      if (isPasswordValid) {
        const token = await user.getJWT(); //  offload token to mongo schema . UserSchema/userSchema methods  aka helper function will be good choice here/ reusable and clean

        // console.log(token);
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        }); // cookie will expire in 8 hrs

        res.status(200).json({
          message: "Login successful",
          user: user,
        });
      } else {
        throw new Error(" Invalid credentials.");
      }
    } else {
      throw new Error(" Invalid credentials.");
    }
  } catch (err) {
    res.status(401).send("Login failed: " + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  //TODO we can add some clean up activities

  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logout successful");
});

module.exports = authRouter;
