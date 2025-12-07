const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.get("/request/:method", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { method } = req.params;
    const { status } = req.query;

    const allowedStatuses = ["ignored", "interested", "accepted", "rejected"];
    const allowedMethods = ["received", "sent"];

    if (status && !allowedStatuses.includes(status)) {
      throw new Error(
        `Provided status(${status}) is invalid. Status can be either ${allowedStatuses.join(
          " or "
        )}.`
      );
    }

    if (!allowedMethods.includes(method)) {
      throw new Error(
        `Provided method(${method}) is invalid. Status can be either ${allowedMethods.join(
          " or "
        )}.`
      );
    }

    const query = { ...(status && { status }) };

    if (method === "received") {
      query.toUserId = loggedInUser._id;
    }

    if (method === "sent") {
      query.fromUserId = loggedInUser._id;
    }

    const connectionRequests = await ConnectionRequest.find(query);

    if (connectionRequests.length === 0) {
      const error = new Error(
        `No ${method} connection requests found with provided status`
      );
      error.status = 404;

      throw error;
    }

    res.json({
      message: `${connectionRequests.length} Connection request(s) found.`,
      data: connectionRequests,
    });
  } catch (error) {
    res.status(error.status ?? 400).json({
      status: error.status ?? 400,
      message: error.message,
    });
  }
});

requestRouter.post(
  "/request/send/:status/:toUserId",
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

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatuses = ["accepted", "rejected"];

      if (!allowedStatuses.includes(status)) {
        throw new Error(
          `Provided status(${status}) is invalid. Status can be either ${allowedStatuses[0]} or ${allowedStatuses[1]}`
        );
      }

      if (!ConnectionRequest.isValidId(requestId)) {
        throw new Error("Connection request id is not valid");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        const error = new Error("Connection request not found");
        error.status = 404;
        throw error;
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        data,
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
