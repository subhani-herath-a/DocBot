// const mongoose = require('mongoose');

// const recordSchema = new mongoose.Schema({
//   patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   filename: String,
//   filepath: String,
//   uploadedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', recordSchema);


 const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  filename: String,
  filepath: String,
  uploadedAt: Date,
  type: { type: String, enum: ['doctor-upload', 'patient-upload'], default: 'doctor-upload' },
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
