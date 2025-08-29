// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model('Notification', notificationSchema);
