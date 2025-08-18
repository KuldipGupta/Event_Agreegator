const mongoose = require('mongoose');

// backend/models/event.js
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  platform: String,
  href: String,
  externalId: String // for external contests
});

module.exports = mongoose.model('Event', eventSchema);