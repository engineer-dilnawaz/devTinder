const express = require("express");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEdits,
  validatePasswordUpdate,
  isStrongPassword,
} = require("../utils/validations");
const { SALT_ROUND } = require("../constants/common");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const {
      firstName,
      lastName,
      emailId,
      bio,
      skills,
      createdAt,
      updatedAt,
      age,
      gender,
      profilePhoto,
    } = user;

    res.send({
      status: "success",
      data: {
        firstName,
        lastName,
        emailId,
        bio,
        skills,
        createdAt,
        updatedAt,
        age,
        gender,
        profilePhoto,
      },
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEdits(req)) {
      throw new Error("Invalid profile edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save({ validateBeforeSave: true });

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully.`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: 400,
        message: "Please provide both oldPassword and newPassword.",
      });
    }

    const loggedInUser = req.user;

    // Use the model method
    await loggedInUser.changePassword(oldPassword, newPassword);

    // 5️⃣ Invalidate old JWT and set new one
    const token = loggedInUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      expires: new Date(Date.now() + 24 * 3600000), // 24 hours
    });

    res.status(200).json({
      status: 200,
      message: `${loggedInUser.firstName}, your password has been updated successfully.`,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
});

module.exports = profileRouter;
