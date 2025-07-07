const express = require('express');
const { createEvent, getEvents } = require('../controllers/eventControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getEvents);
router.post('/', authMiddleware, createEvent);

module.exports = router;