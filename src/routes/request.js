const express = require("express");

const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post(
  "/sendConnection/:requestedUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const requestedUserId = req.params?.requestedUserId;

      if (user._id.equals(requestedUserId)) {
        throw new Error("You cannot send request to your own account");
      }

      res.send({
        status: "success",
        message: `${user.firstName} is trying to send request to ${requestedUserId}`,
      });
    } catch (error) {
      res.status(400).send({
        message: error.message,
      });
    }
  }
);

module.exports = requestRouter;
