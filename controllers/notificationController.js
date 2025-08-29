// // controllers/notificationController.js

// const Notification = require('../models/Notification');

// // ✅ Define this function
// const getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find().sort({ createdAt: -1 });
//     res.status(200).json(notifications);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch notifications' });
//   }
// };

// const createNotification = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const notification = new Notification({ message });
//     await notification.save();
//     res.status(201).json(notification);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating notification', error });
//   }
// };

// // ✅ Now both are defined and exported
// module.exports = {
//   getNotifications,
//   createNotification,
// };




// controllers/notificationController.js
const Notification = require('../models/Notification');

// GET /api/notifications (newest first)
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// PUT /api/notifications/:id/read
const markNotificationRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Notification not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

// (Optional) POST /api/notifications  — create manually if you want
const createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const note = new Notification({ message });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  createNotification,
};
