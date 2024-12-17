const mongoose = require("mongoose");

const BlockedUserSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friends: { type: Boolean, default: false },
    follower: { type: Boolean, default: false },
    following: { type: Boolean, default: false },
    sendRequest: { type: Boolean, default: false },
    reveivedRequest: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlockedUser", BlockedUserSchema);
