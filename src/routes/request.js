const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/sendConnection/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user?._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;
      const toUser = await User.findById(toUserId);

      const allowedRequestStatus = ["ignored", "interested"];

      if (!allowedRequestStatus.includes(status)) {
        throw new Error("Invalid status type: " + status);
      }

      // if (user._id.equals(toUserId)) {
      //   throw new Error("You cannot send request to your own account");
      // }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists");
      }

      if (!toUser) {
        const error = new Error("User doesn't exits");
        error.status = 404;
        throw error;
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      res.send({
        status: "success",
        message:
          status === "interested"
            ? `You have sent connection request to ${toUser?.firstName}`
            : `You have ignored the ${toUser?.firstName}`,
        data: connectionRequest,
      });
    } catch (error) {
      res.status(error.status ?? 400).json({
        status: error.status ?? 400,
        message: error.message,
      });
    }
  }
);

module.exports = requestRouter;
