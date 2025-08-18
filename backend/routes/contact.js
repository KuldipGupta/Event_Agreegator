const express = require('express');
const router = express.Router();

// For email, you can use nodemailer or just log for now
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // TODO: Send email or save to DB. For now, just log:
  console.log('Contact Us Submission:', { name, email, message });

  // Example: send success response
  res.json({ message: 'Message received. Thank you!' });
});

module.exports = router;