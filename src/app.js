const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const { isEmailValid, isEmpty } = require("./utils/validations");
const { userAuth } = require("./middlewares/auth");
const { PORT, SALT_ROUND, JWT_SECRET } = require("./constants/common");
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

    const token = jwt.sign({ _id: userData._id }, JWT_SECRET);
    res.cookie("token", token);

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

app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await User.findOne({ emailId });

    if (!user) {
      res.status(404).send("User with given email id cannot be found.");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong!!");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);

    if (user) {
      res.send({
        status: true,
        data: user,
        message: `${user.firstName} is deleted successfully`,
      });
    } else {
      res.send({
        status: true,
        data: undefined,
        message: "User with this id does not exists.",
      });
    }
  } catch (error) {
    res.status(400).send("Something went wrong!!" + error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;

  if (!userId) {
    throw new Error("User Id is mandatory to update the user record.");
  }

  const data = req.body;
  const allowedUpdateFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "bio",
    "skills",
    "profilePhoto",
    "password",
  ];

  const isUpdateAllowed = Object.keys(data).every((key) =>
    allowedUpdateFields.includes(key)
  );

  try {
    if (!isUpdateAllowed) {
      throw new Error("You cannot update email id once it's set.");
    }

    const updatedData = await User.findByIdAndUpdate(userId, data, {
      new: true,
      // returnDocument: "before",
      lean: true,
      runValidators: true,
    });

    if (!updatedData) {
      res.status(404).send("User with given id is not found.");
    } else {
      res.send({
        status: true,
        message: `${updatedData?.firstName}'s profile has updated successfully.`,
        data: updatedData,
      });
    }
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
});

app.patch("/updateUserByEmail", async (req, res) => {
  const query = { emailId: req.body.emailId };
  const data = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(query, data, {
      returnDocument: "after",
    });
    if (updatedUser) {
      res.send({
        status: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    } else {
      res.status(404).send({
        status: false,
        data: undefined,
        message: "User with provided email cannot be found.",
      });
    }
  } catch (error) {
    res.status(400).send("Something went wrong!!" + error.message);
  }
});

app.get("/userCount", async (req, res) => {
  try {
    const result = await User.countDocuments({});
    res.send({ count: result });
  } catch (error) {
    res.status(400).send("Something went wrong!!" + error.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send({
      status: true,
      data: allUsers,
      total: allUsers.length,
    });
  } catch (error) {
    res.status(400).send("Something went wrong!!");
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
