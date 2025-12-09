const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { timeAgo } = require("../utils/date");
const User = require("../models/user");

const userRoute = express.Router();

const USER_PUBLIC_DATA =
  "firstName lastName profilePhoto bio skills age gender";

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
      .populate("fromUserId", USER_PUBLIC_DATA)
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
          select: USER_PUBLIC_DATA,
        },
        {
          path: "toUserId",
          select: USER_PUBLIC_DATA,
        },
      ])
      .lean();

    const formatted = connectionsList.map((item) => {
      const isLoggedInUserSender = item.fromUserId._id.equals(loggedInUser._id);

      return {
        // ...item,
        // user:
        ...(isLoggedInUserSender ? item.toUserId : item.fromUserId),
        // fromUserId: undefined,
        // toUserId: undefined,
        // createdAtAgo: timeAgo(item.createdAt),
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

userRoute.get("/feed", userAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    let limit = Math.max(10, parseInt(req.query.limit) || 10);
    limit = Math.min(limit, 50);

    const skip = (page - 1) * limit;
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set(
      connectionRequests.flatMap((req) => [
        req.fromUserId.toString(),
        req.toUserId.toString(),
      ])
    );

    hideUsersFromFeed.add(loggedInUser._id.toString()); // never show self

    const totalUsers = await User.countDocuments({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    });

    const totalPages = Math.ceil(totalUsers / limit);

    //if page > totalPages, return empty results

    if (page > totalPages && totalPages > 0)
      return res.json({
        page,
        limit,
        totalUsers,
        totalPages,
        nexPage: null,
        prevPage: page > 1 ? page - 1 : null,
        count: 0,
        data: [],
      });

    const users = await User.find({
      // $and: [
      // {
      _id: {
        $nin: Array.from(hideUsersFromFeed),
      },
      // },
      // {
      // _id: {
      // $ne: loggedInUser._id,
      // },
      // },
      // ],
    })
      .select(USER_PUBLIC_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      totalUsers,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(error.status ?? 400).json({
      status: error.status ?? 400,
      message: error.message,
    });
  }
});

module.exports = userRoute;
