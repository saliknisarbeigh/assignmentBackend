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

const { userAuth } = require("./middlewares/auth");

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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (validator.isEmail(emailId)) {
      const user = await User.findOne({ emailId: emailId });

      if (!user) {
        throw new Error("Login failed: Invalid credentials.");
      }
      const isPasswordValid = await user.validatePassword(password); //offload  to mongo schema . UserSchema/userSchema methods  aka helper function will be good choice here/ reusable and clean
      // const isPasswordValid = await bcrypt.compare(password, user.password); //
      if (isPasswordValid) {
        // TODO write a good expire date for token and cookies

        // const token = jwt.sign({ _id: user._id }, "pulse@511", {
        //   expiresIn: "7d",
        // });

        const token = await user.getJWT(); //  offload token to mongo schema . UserSchema/userSchema methods  aka helper function will be good choice here/ reusable and clean

        // console.log(token);
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        }); // cookie will expire in 8 hrs

        res.status(200).send("Login successful.");
      } else {
        throw new Error("Login failed: Password is incorrect.");
      }
    }
  } catch (err) {
    res.status(401).send("Login failed: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
});
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;

  res.send(user.firstName + " sends you a connection request");
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
