const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema(
  {
    reply: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reply", ReplySchema);
