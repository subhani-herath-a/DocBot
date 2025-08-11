
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const { verifyToken } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// GET records for logged-in patient
router.get('/records', verifyToken, async (req, res) => {
  try {
    const patientId = req.user.id;

    const records = await MedicalRecord.find({ patientId })
      .populate('appointmentId', 'date time')
      .populate('doctorId', 'firstName lastName specialty')
      .sort({ uploadedAt: -1 });

    res.json(records);
  } catch (err) {
    console.error('[Get Patient Records Error]', err);
    res.status(500).json({ message: 'Failed to fetch records' });
  }
});

router.post('/:appointmentId', upload.single('file'), async (req, res) => {
  const appointmentId = req.params.appointmentId;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
  const fileUrl = `/uploads/${req.file.filename}`;

  try {
    // 1. Save to medicalRecords
    const record = new MedicalRecord({
      filename: req.file.originalname,
      filepath: filePath,
    });
    await record.save();

    // 2. Update appointment
    // Save the file info into File collection first
const fileDoc = await File.create({
  filename: req.file.filename,
  filepath: fileUrl,
  uploadedAt: new Date(),
});

// Now update the appointment with fileId = ObjectId
const updatedAppointment = await Appointment.findByIdAndUpdate(
  appointmentId,
  {
    fileUrl,
    fileId: fileDoc._id, // ✅ Correct: MongoDB ObjectId
  },
  { new: true }
);


    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Upload successful',
      fileUrl: updatedAppointment.fileUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
