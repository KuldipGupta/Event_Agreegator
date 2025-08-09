const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const auth = require('../middleware/authMiddleware');

// Ensure uploads/profile directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'profile');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/', auth.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email bio profileImage collegeName dob gender age department mobile');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/', auth.protect, async (req, res) => {
  try {
    const { name, email, bio, collegeName, dob, gender, age, department, mobile } = req.body;
    const updates = { name, email, bio, collegeName, dob, gender, age, department, mobile };
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('name email bio profileImage collegeName dob gender age department mobile');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/profile-image', auth.protect, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const profileImageUrl = `/uploads/profile/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: profileImageUrl },
      { new: true }
    ).select('profileImage');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ profileImage: profileImageUrl, message: 'Profile image uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;