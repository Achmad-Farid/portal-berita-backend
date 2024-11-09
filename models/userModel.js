const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String },
  authProvider: { type: String, enum: ["email", "google"], required: true },
  profilePicture: String,
  role: { type: String, enum: ["admin", "user", "journalist"], default: "user" },
});

module.exports = mongoose.model("User", UserSchema);
