const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserActivitySchema = new Schema({
  activity: {
    type: String,
    required: true,
    enum: [
      "follow",
      "unfollow",
      "postInteractions",
      "commented",
      "replied",
      "newFriend",
      "newPost",
    ],
  },
  message: { type: String, required: true },
  associatedUser: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new Schema(
  {
    // _id is automatically added
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: { type: String },
    recentActivity: { type: [UserActivitySchema], default: [] },
    location: {
      city: { type: String },
      country: { type: String },
    },
    fcmToken: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Remove password from the response
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", UserSchema); // Define name and schema for collection
