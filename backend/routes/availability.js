// // backend/routes/availability.js

// const express = require('express');
// const router = express.Router();
// const { create, listByDoctor } = require('../controllers/availabilityController');

// // ✅ POST: Save a new availability slot
// router.post('/', async (req, res) => {
//   try {
//     const { doctorId, day, start, end } = req.body;
//     if (!doctorId || !day || !start || !end)
//       return res.status(400).json({ message: 'Missing fields' });

//     const normalizedDay = new Date(day).toISOString().split('T')[0];

//     const availability = await require('../models/Availability').create({
//       doctorId,
//       day: normalizedDay,
//       start,
//       end,
//     });

//     res.status(201).json(availability);
//   } catch (err) {
//     console.error('Error creating availability:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // ✅ GET: Fetch all availability for a doctor
// router.get('/doctor/:doctorId', listByDoctor); // This now uses the controller function directly

// module.exports = router;
// backend/routes/availability.js
const express = require('express');
const router = express.Router();
const {
  create,
  listByDoctor,
} = require('../controllers/availabilityController');

// Save availability
router.post('/', create);

// Get availability for a doctor
router.get('/doctor/:doctorId', require('../controllers/availabilityController').listByDoctor);
router.get('/doctor/:id/date/:date', async (req, res) => {
  try {
    const { id, date } = req.params;
    const slots = await Availability.findOne({ doctorId: id, date });
    if (!slots) return res.json([]);
    res.json(slots.timeSlots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
