const express = require("express");

const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello Express JS");
});

const PORT = 3001;
app.listen(PORT, (error) => {
  if (error) {
    console.log("Oops error while listen() =>", error);
  } else {
    console.log("app is listening at port " + PORT);
  }
});
