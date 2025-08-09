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
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: { type: String, default: '' },
  profileImage: { type: String, default: '' }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
