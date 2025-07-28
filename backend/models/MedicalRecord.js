const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  filepath: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', recordSchema);


 