
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  reason: { type: String },
  fileUrl: { type: String, default: null },
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null },
  status: { type: String, default: 'Pending' },
});


module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
