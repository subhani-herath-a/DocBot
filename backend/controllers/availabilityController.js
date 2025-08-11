
// const Availability = require('../models/Availability');
// const mongoose = require('mongoose');

// // ✅ Create and save availability
// const create = async (req, res) => {
//   try {
//     const { doctorId, day, start, end } = req.body;

//     if (!doctorId || !day || !start || !end) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Normalize date to YYYY-MM-DD
//     const normalizedDay = new Date(day).toISOString().split('T')[0];

//     const newSlot = new Availability({
//       doctorId,
//       day: normalizedDay,
//       start,
//       end
//     });

//     await newSlot.save();

//     console.log("✅ Saved availability:", newSlot);
//     res.status(201).json(newSlot);
//   } catch (err) {
//     console.error("❌ Failed to save availability:", err.message);
//     res.status(500).json({ message: 'Failed to save availability' });
//   }
// };

// // ✅ Fetch slots by doctorId — convert to ObjectId to match MongoDB
// const listByDoctor = async (req, res) => {
//   try {
//     const doctorId = new mongoose.Types.ObjectId(req.params.doctorId);
//     console.log('🔍 Doctor ID requested:', doctorId);

//     const slots = await Availability.find({ doctorId }).sort({ day: 1 });
//     console.log('📦 Found slots:', slots);

//     res.json(slots);
//   } catch (err) {
//     console.error('❌ Fetch error:', err.message);
//     res.status(500).json({ message: 'Failed to fetch availability' });
//   }
// };

// module.exports = {
//   create,
//   listByDoctor,
// };
const Availability = require('../models/Availability');

// CREATE 30-min slots between start and end time for selected date
const create = async (req, res) => {
  try {
    const { doctorId, day, start, end } = req.body;

    if (!doctorId || !day || !start || !end) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const current = new Date(`${day}T${start}`);
    const endTime = new Date(`${day}T${end}`);

    const newSlots = [];

    while (current < endTime) {
      const time = current.toTimeString().slice(0, 5); // 'HH:mm'
      newSlots.push({
        doctorId,
        date: day,
        time,
        booked: false,
      });
      current.setMinutes(current.getMinutes() + 30); // generate next 30-min slot
    }

    const saved = await Availability.insertMany(newSlots);
    console.log('✅ Generated slots:', saved.length);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error generating availability slots:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// LIST all availability slots for a given doctor
const listByDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const slots = await Availability.find({ doctorId }).sort({ date: 1, time: 1 });
    res.status(200).json(slots);
  } catch (err) {
    console.error('❌ Error fetching slots for doctor:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  listByDoctor,
};
