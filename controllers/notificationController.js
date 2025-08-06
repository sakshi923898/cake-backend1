// controllers/notificationController.js

const Notification = require('../models/Notification');

const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const notification = new Notification({ message });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

module.exports = {
  getNotifications,
  createNotification,
};
