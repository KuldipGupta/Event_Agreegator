const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  collegeName: String,
  dob: String,
  gender: String,
  age: Number,
  department: String,
  mobile: String,
  email: String,
});

// Prevent OverwriteModelError in dev/hot-reload
module.exports = mongoose.models.User || mongoose.model('User', userSchema);