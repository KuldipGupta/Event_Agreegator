const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Event = require('../models/event');
const { protect } = require('../middleware/authMiddleware');

// Register for an event (handles external contests)
router.post('/register/:eventId', protect, async (req, res) => {
  const user = req.user;
  // Try to find event by externalId
  let event = await Event.findOne({ externalId: req.params.eventId });
  if (!event) {
    // Create new event from external contest data
    event = new Event({
      externalId: req.params.eventId,
      title: req.body.event,
      platform: req.body.resource,
      date: req.body.start,
      description: req.body.description || '',
      href: req.body.href
    });
    await event.save();
  }
  // Add to registrations if not already present
  if (!user.registrations.includes(event._id)) {
    user.registrations.push(event._id);
    await user.save();
  }
  res.json({ message: 'Registered for event' });
});

// Add to favorites (handles external contests)
router.post('/favorite/:eventId', protect, async (req, res) => {
  const user = req.user;
  let event = await Event.findOne({ externalId: req.params.eventId });
  if (!event) {
    event = new Event({
      externalId: req.params.eventId,
      title: req.body.event,
      platform: req.body.resource,
      date: req.body.start,
      description: req.body.description || '',
      href: req.body.href
    });
    await event.save();
  }
  if (!user.favorites.includes(event._id)) {
    user.favorites.push(event._id);
    await user.save();
  }
  res.json({ message: 'Added to favorites' });
});

// Get personal dashboard data
router.get('/dashboard', protect, async (req, res) => {
  await req.user.populate('favorites registrations');
  res.json({
    favorites: req.user.favorites,
    registrations: req.user.registrations
  });
});

module.exports = router;