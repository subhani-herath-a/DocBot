
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true }, // Format: HH:mm
  booked: { type: Boolean, default: false }
});

module.exports = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);
