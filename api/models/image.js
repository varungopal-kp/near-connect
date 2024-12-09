const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
