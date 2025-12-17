const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { isEmailValid, isEmpty } = require("../utils/validations");
const { SALT_ROUND } = require("../constants/common");
const { USER_PUBLIC_DATA } = require("./user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.send("User data saved successfully...");
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (isEmpty(emailId) || isEmpty(password)) {
      throw new Error("Enter or Password is required to log in");
    }

    if (!isEmailValid(emailId)) {
      throw new Error("Enter a valid email");
    }

    const userData = await User.findOne({ emailId });

    if (!userData) {
      throw new Error(
        // NEVER EXPOSE YOUR DB TO allow Attackers to know what needs to be tweaked
        // "User with this email is not registered yet. Please sign up first"
        "Invalid credentails"
      );
    }

    const isPasswordValid = await userData.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error(
        // NEVER EXPOSE YOUR DB TO allow Attackers to know what needs to be tweaked
        // "Enter a valid password to login"
        "Invalid credentails"
      );
    }

    const token = userData.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 24 hours
    });

    res.send({
      message: "Logged In Successfully",
      authToken: token,
      user: userData.toJSON(),
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send({
    status: "success",
    message: "Logged out successfully.",
  });
});

module.exports = authRouter;
