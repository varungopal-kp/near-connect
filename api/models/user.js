const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  { // _id is automatically added
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Remove password from the response
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};


module.exports = mongoose.model("User", UserSchema);
