const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  date: Date,
  time: String,
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Event', eventSchema);
