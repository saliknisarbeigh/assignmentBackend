const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      unique: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 50,
      trim: true,
      unique: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,

      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password is not strong. It must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol (e.g., !@#$%^&*)."
          );
        }
      },
    },
    age: {
      required: true,
      type: Number,
      min: 18,
      trim: true,
    },
    gender: {
      required: true,
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`,
      },
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error(
      //       "Gender must be 'male', 'female', or 'others'. Received: " + value
      //     );
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/005/544/770/small/profile-icon-design-free-vector.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "hey there this is a default value",
      maxLength: 250,
    },
    skills: {
      type: [String],

      validate: {
        validator: function (val) {
          return val.length <= 10;
        },
        message: "You can select at most 10 skills",
      },
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.index({ firstName: 1, lastName: 1 });
// TODO write a good expire date for token and cookies
UserSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "pulse@511", {
    expiresIn: "7d",
  });
  return token;
};

UserSchema.methods.validatePassword = async function (passwordInputByUser) {
  user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};
// const UserModel=new mongoose.model("user",UserSchema)
// module.exports=UserModel
module.exports = mongoose.model("user", UserSchema);
