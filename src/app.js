const express = require("express");

const { PORT } = require("./constants/common");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  /*
  {
      firstName: "Dilnawaz",
      lastName: "Khan",
      emailId: "dilnawaz.khan@nodejs.me",
      password: "Qwerty@123",
    }
  */

  try {
    const user = new User(req.body);
    await user.save();
    res.send("User data saved successfully...");
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
