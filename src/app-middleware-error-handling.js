const express = require("express");

const { adminAuth } = require("./middlewares/auth");
const { PORT } = require("./constants/common");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/all-user", (req, res) => {
  const users = [
    {
      id: 101,
      name: "John Doe",
    },
    {
      id: 102,
      name: "Jennifer Lopez",
    },
  ];

  res.send({ status: true, data: users });
});

app.delete("/admin/delete-user/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (Number.isNaN(id)) {
    return res.status(400).send({
      status: false,
      message: "Invalid user ID",
    });
  }

  let users = [
    { id: 101, name: "John Doe" },
    { id: 102, name: "Jennifer Lopez" },
  ];

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send({
      status: false,
      message: "User not found",
    });
  }

  // Simulate deletion
  users = users.filter((u) => u.id !== id);

  return res.send({
    status: true,
    message: "User deleted successfully",
    deletedUser: user,
  });
});

// Error handling

app.get("/allUsers", (req, res, next) => {
  try {
    throw new Error("DB str is invalid");
    res.send("All users");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use("/", (error, req, res, next) => {
  if (error) {
    res.status(500).send("Something went wrong");
  }
});

// app.use("/", (req, res, next) => {
//   console.log("I am acting as middleware");
//   next();
// });

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("first route handler");
//     next();
//   },
//   (req, res, next) => {
//     console.log("second route handler");
//     res.send("Gotcha in 2nd route");
//   }
// );

app.listen(PORT, (error) => {
  if (error) {
    console.log("Oops error while listen() =>", error);
  } else {
    console.log("app is listening at port " + PORT);
  }
});
