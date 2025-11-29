const mongose = require("mongoose");

const { CONNECTION_STRING } = require("../constants/mongo-db");

const connectDB = async () => {
  await mongose.connect(CONNECTION_STRING);
};

module.exports = connectDB;
