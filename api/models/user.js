const mongoose = require("mongoose");
const { create } = require("./post");
const Schema = mongoose.Schema;

const UserActivitySchema = new Schema({
  activity: { type: String, required: true },
  associatedUser: { type: Schema.Types.ObjectId, ref: "User" },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
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
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Remove password from the response
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", UserSchema);    // Define name and schema for collection
