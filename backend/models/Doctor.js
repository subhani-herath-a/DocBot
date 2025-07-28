const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  specialty:  { type: String, required: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
