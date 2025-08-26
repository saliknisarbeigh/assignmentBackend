const express = require("express");
const profileRouter = express.Router();
const { validateProfileEditData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
const authRouter = require("./authRouter");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateProfileEditData(req);
    const loggedInUser = req.user;

    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    console.log(loggedInUser);

    res.json({
      message: `${loggedInUser.firstName},your profile updated successful`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/update-password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).send("password is required");
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).send("please enter a strong password");
    }

    const loggedInUser = req.user;

    const isSameAsCurrent = await bcrypt.compare(
      password,
      loggedInUser.password
    );
    if (isSameAsCurrent) {
      return res
        .status(400)
        .send("New password must be different from current password");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    loggedInUser.password = passwordHash;
    await loggedInUser.save();

    res.status(200).send("Password updated successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
