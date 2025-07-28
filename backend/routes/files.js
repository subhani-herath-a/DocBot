
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/auth');

const MedicalRecord = require('../models/MedicalRecord');
const Notification = require('../models/Notification');

/* ----------  MULTER STORAGE CONFIG  ---------- */
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

/* ----------  POST /api/files/upload ---------- */
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { patientId, doctorId } = req.body;

    if (!req.file || !patientId || !doctorId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newRecord = await MedicalRecord.create({
      patientId,
      doctorId,
      filename: req.file.filename,
      filepath: req.file.path,
    });

    // Send notifications to doctor and patient
    await Notification.insertMany([
      { userId: doctorId, message: `New medical record uploaded by patient` },
      { userId: patientId, message: `Doctor received your record` },
    ]);

    res.status(201).json({ message: 'File uploaded successfully', record: newRecord });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

/* ----------  GET /api/files/records ---------- */
/* Logged-in user (patient) can fetch their records */
router.get('/records', verifyToken, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user.id }).sort({ uploadedAt: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching records' });
  }
});

/* ----------  GET /api/files/all (Admin View) ---------- */
router.get('/all', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const allRecords = await MedicalRecord.find().sort({ uploadedAt: -1 });
    res.json(allRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching all records' });
  }
});

/* ----------  DOWNLOAD /api/files/:filename ---------- */
router.get('/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

module.exports = router;
