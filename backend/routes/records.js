const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

// Doctor uploads record after consultation
router.post('/upload/:appointmentId', upload.single('file'), async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const appointment = await Appointment.findById(appointmentId).populate('patientId');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const fileUrl = `/uploads/${req.file.filename}`.replace(/\\/g, '/');

    const record = await MedicalRecord.create({
      appointmentId: appointment._id,
      patientId: appointment.patientId._id,
      doctorId: appointment.doctorId,
      filename: req.file.filename,
      filepath: fileUrl,
      uploadedAt: new Date(),
      type: 'doctor-upload',
    });

    return res.status(201).json({ message: 'Record uploaded successfully', record });
  } catch (err) {
    console.error('Doctor record upload error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
