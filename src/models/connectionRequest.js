const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Sender user id is mandatory"],
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Receiver user is is mandatory"],
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: "{VALUE} is incorrect status type",
      },
      lowercase: [true, "status should in lowercase"],
      default: "ignore",
    },
  },
  {
    timestamps: true,
  }
);
