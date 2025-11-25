const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello Express JS");
});

app.get("/user", (req, res) => {
  res.send({
    firstName: "Dilnawaz",
    lastName: "Khan",
  });
});

app.post("/user", (req, res) => {
  res.send({
    firstName: "Dilnawaz - ",
    lastName: "Khan",
  });
});

app.patch("/user", (req, res) => {
  res.send({
    firstName: "Dilnawaz ",
    lastName: "Khan",
  });
});

app.put("/user", (req, res) => {
  res.send({
    firstName: "Dilnawaz - ",
    lastName: "Khan",
  });
});

app.delete("/user", (req, res) => {
  res.send({
    firstName: "Dilnawaz - ",
    lastName: "Khan",
  });
});

// Regular expression route

// {e} means e is optional
app.get("/t{e}st", (req, res) => {
  res.send({ status: true });
});

// * means anything in between te(anything)st
app.get("/te*st", (req, res) => {
  res.send("* operator in req" + req.url);
});

// query and params

app.get("/abc/:userId", (req, res) => {
  console.log(req.params);
  console.log(req.query);
  res.send("response => " + req.url);
});

const PORT = 3001;
app.listen(PORT, (error) => {
  if (error) {
    console.log("Oops error while listen() =>", error);
  } else {
    console.log("app is listening at port " + PORT);
  }
});
