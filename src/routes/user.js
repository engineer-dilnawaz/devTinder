const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { timeAgo } = require("../utils/date");

const userRoute = express.Router();

userRoute.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find(
      {
        toUserId: loggedInUser._id,
        status: "interested",
      },
      {
        __v: 0,
        updatedAt: 0,
      }
    )
      .populate(
        "fromUserId",
        "firstName lastName profilePhoto bio skills age gender"
      )
      .lean(); // <-- important

    // Rename fromUserId → sender
    const formatted = connectionRequests.map((req) => ({
      ...req,
      sender: req.fromUserId,
      fromUserId: undefined, // remove original
    }));

    res.json({
      message: `You have ${formatted.length} connection request(s).`,
      data: formatted,
    });
  } catch (error) {
    res.status(error.status ?? 400).json({
      status: error.status ?? 400,
      message: error.message,
    });
  }
});

userRoute.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionsList = await ConnectionRequest.find(
      {
        $or: [
          {
            toUserId: loggedInUser._id,
          },
          {
            fromUserId: loggedInUser._id,
          },
        ],
        status: "accepted",
      },
      {
        __v: 0,
        updatedAt: 0,
      }
    )
      .populate([
        {
          path: "fromUserId",
          select: "firstName lastName profilePhoto bio skills age gender",
        },
        {
          path: "toUserId",
          select: "firstName lastName profilePhoto bio skills age gender",
        },
      ])
      .lean();

    const formatted = connectionsList.map((item) => {
      const isLoggedInUserSender = item.fromUserId._id.equals(loggedInUser._id);

      return {
        ...item,
        user: isLoggedInUserSender ? item.toUserId : item.fromUserId,
        fromUserId: undefined,
        toUserId: undefined,
        createdAtAgo: timeAgo(item.createdAt),
      };
    });

    res.json({
      message: `You have ${formatted.length} connection(s).`,
      data: formatted,
    });
  } catch (error) {
    res.status(error.status ?? 400).json({
      status: error.status ?? 400,
      message: error.message,
    });
  }
});

module.exports = userRoute;
