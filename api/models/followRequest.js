const mongoose = require("mongoose");

const FollowRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "rejected"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FollowRequest", FollowRequestSchema);
