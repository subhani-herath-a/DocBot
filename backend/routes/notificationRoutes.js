const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// 📨 Get notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Mark all as read
router.put('/mark-all-read/:userId', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId, isRead: false }, { isRead: true });
    res.json({ message: 'Marked all as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
