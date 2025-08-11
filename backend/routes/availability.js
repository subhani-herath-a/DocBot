
const express = require('express');
const router = express.Router();
const { create, listByDoctor } = require('../controllers/availabilityController');
const Availability = require('../models/Availability');

// ✅ Save 30-minute slot availabilities (for doctors)
router.post('/', create);

// ✅ Get all slots for a doctor (used in doctor dashboard)
router.get('/doctor/:doctorId', listByDoctor);

// ✅ Get unbooked slots for a doctor on a specific date (used in patient booking)
router.get('/doctor/:id/date/:date', async (req, res) => {
  try {
    const { id, date } = req.params;

    const slots = await Availability.find({
      doctorId: id,
      date,
      booked: false
    }).sort({ time: 1 });

    res.json(slots);
  } catch (err) {
    console.error('❌ Error fetching available slots:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
