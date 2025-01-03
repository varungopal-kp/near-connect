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
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: { type: String },
    backgroundPic: { type: String },
    recentActivity: { type: [UserActivitySchema], default: [] },
    place: { type: String },
    pincode: { type: String },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" }, // 'Point' for GeoJSON standard
      coordinates: { type: [Number], required: true, default: [0, 0] }, // [longitude, latitude]
    },
    followersCount: { type: Number, default: 0 },
    friendsCount: { type: Number, default: 0 },
    requestsCount: { type: Number, default: 0 },
    about: { type: String, default: "Hi, lets connect!" },
    gender: { type: String },
    dob: { type: Date },
    thumbnail: { type: String },
    fcmToken: { type: String },
    online: {
      socketIds: { type: [String], default: [] },
      lastSeen: { type: Date },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

UserSchema.index({ location: "2dsphere" });

// Remove password from the response
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", UserSchema); // Define name and schema for collection
