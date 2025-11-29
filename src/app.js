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
    res.status(400).send("Error saving user data " + error.message);
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

app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});

    res.send(allUsers);
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
