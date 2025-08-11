
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  phone:      { type: String },
  address:    { type: String },
  dob:        { type: Date },
  role:       { type: String, default: 'patient', required: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);