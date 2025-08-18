const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  email: String,
  collegeName: String,
  dob: String,
  gender: String,
  age: String,
  department: String,
  mobile: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = mongoose.model('User', userSchema);