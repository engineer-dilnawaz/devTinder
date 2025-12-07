const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender user id is mandatory"],
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Receiver user is is mandatory"],
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is incorrect status type",
      },
      lowercase: [true, "status should in lowercase"],
      default: "ignored",
    },
  },
  {
    timestamps: true,
  }
);

connectionRequest.index({ fromUserId: 1, toUserId: 1 });

connectionRequest.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId)) {
    const error = new Error(
      "You cannot send connection request to your own account."
    );
    error.status = 400;
    throw error;
  }
});

// Static methods
connectionRequest.statics.isValidId = function (id) {
  return mongoose.Types.ObjectId.isValid(id);
};

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequest
);

module.exports = ConnectionRequest;
