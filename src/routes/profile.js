const express = require("express");
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEdits,
  validatePasswordUpdate,
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
    if (!validatePasswordUpdate(req)) {
      throw new Error("Provide the valid json to update your password");
    }

    const loggedInUser = req.user;

    const isOldPasswordCorrect = await loggedInUser.validatePassword(
      req.body.oldPassword
    );

    if (!isOldPasswordCorrect) {
      throw new Error("Old password is not correct");
    }

    const isSameAsOld = await loggedInUser.validatePassword(
      req.body.newPassword
    );

    if (isSameAsOld) {
      throw new Error("New password cannot be the same as the old password.");
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, SALT_ROUND);
    loggedInUser.password = hashedPassword;

    await loggedInUser.save({ validateBeforeSave: true });

    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    const token = loggedInUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 24 hours
    });

    res.json({
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
