const mongose = require("mongoose");

const userSchema = new mongose.Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  age: Number,
  gender: String,
});

const User = mongose.model("User", userSchema);

module.exports = User;
