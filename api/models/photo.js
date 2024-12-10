const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    path: { type: String, required: true },
    filename: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Photo", PhotoSchema);
