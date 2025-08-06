// routes/notification.js

const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification'); // model path

// Get all notifications (for Owner)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = router;
