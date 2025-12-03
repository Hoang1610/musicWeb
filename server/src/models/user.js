const mongoose = require("mongoose");
const songLikeSchema = new mongoose.Schema({
  songId: String,
});
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  pass: String,
  songLike: [songLikeSchema],
});
const User = mongoose.model("user", userSchema);
module.exports = User;
