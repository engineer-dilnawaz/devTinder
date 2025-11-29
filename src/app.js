const express = require("express");

const { PORT } = require("./constants/common");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Dilnawaz",
    lastName: "Khan",
    emailId: "dilnawaz.khan@nodejs.me",
    password: "Qwerty@123",
  });

  await user.save();

  res.send("User data saved successfully...");
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
