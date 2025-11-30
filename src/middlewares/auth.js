const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../constants/common.js");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Auth token is not valid.");
    }

    const { _id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: ", error.message);
  }
};

module.exports = {
  userAuth,
};
