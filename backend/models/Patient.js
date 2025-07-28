const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    default: 'patient'
  }
});

module.exports = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
