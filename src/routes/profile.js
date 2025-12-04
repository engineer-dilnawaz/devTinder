const express = require("express");

const { userAuth } = require("../middlewares/auth");

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

module.exports = profileRouter;
