const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const { isEmailValid, isEmpty } = require("./utils/validations");
const { userAuth } = require("./middlewares/auth");
const {
  PORT,
  SALT_ROUND,
  JWT_SECRET,
  JWT_EXPIRE,
} = require("./constants/common");
const connectDB = require("./config/database");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      throw new Error(
        // NEVER EXPOSE YOUR DB TO allow Attackers to know what needs to be tweaked
        // "Enter a valid password to login"
        "Invalid credentails"
      );
    }

    const token = jwt.sign({ _id: userData._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000), // cookie will be removed after 8 hours
    });

    res.send({
      message: "Logged In Successfully",
      authToken: token,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

app.get("/profile", userAuth, async (req, res) => {
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

app.post("/sendConnection/:requestedUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requestedUserId = req.params?.requestedUserId;

    if (user._id.equals(requestedUserId)) {
      throw new Error("You cannot send request to your own account");
    }

    res.send({
      status: "success",
      message: `${user.firstName} is trying to send request to ${requestedUserId}`,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, (error) => {
      if (error) {
        console.log("Oops error while listen() =>", error);
      } else {
        console.log("app is listening at port " + PORT);
      }
    });
  })
  .catch((error) => {
    console.error("Database connection failed: ", error);
  });
