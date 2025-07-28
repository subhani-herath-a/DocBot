const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  day: String, // Format: YYYY-MM-DD
  start: String, // Format: HH:mm
  end: String    // Format: HH:mm
});


module.exports = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);