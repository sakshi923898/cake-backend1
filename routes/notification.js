// routes/notification.js
const express = require('express');
const {
  getNotifications,
  markNotificationRead,
  createNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.post('/', createNotification); // optional

module.exports = router;
