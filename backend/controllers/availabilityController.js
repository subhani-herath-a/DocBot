
const Availability = require('../models/Availability');
const mongoose = require('mongoose');

// ✅ Create and save availability
const create = async (req, res) => {
  try {
    const { doctorId, day, start, end } = req.body;

    if (!doctorId || !day || !start || !end) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Normalize date to YYYY-MM-DD
    const normalizedDay = new Date(day).toISOString().split('T')[0];

    const newSlot = new Availability({
      doctorId,
      day: normalizedDay,
      start,
      end
    });

    await newSlot.save();

    console.log("✅ Saved availability:", newSlot);
    res.status(201).json(newSlot);
  } catch (err) {
    console.error("❌ Failed to save availability:", err.message);
    res.status(500).json({ message: 'Failed to save availability' });
  }
};

// ✅ Fetch slots by doctorId — convert to ObjectId to match MongoDB
const listByDoctor = async (req, res) => {
  try {
    const doctorId = new mongoose.Types.ObjectId(req.params.doctorId);
    console.log('🔍 Doctor ID requested:', doctorId);

    const slots = await Availability.find({ doctorId }).sort({ day: 1 });
    console.log('📦 Found slots:', slots);

    res.json(slots);
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch availability' });
  }
};

module.exports = {
  create,
  listByDoctor,
};
