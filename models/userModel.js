const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  username: String,
  password: String,
  authProvider: { type: String, enum: ["email", "google"], required: true },
  profilePicture: String,
});

module.exports = mongoose.model("User", UserSchema);
