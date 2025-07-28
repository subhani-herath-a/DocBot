// backend/routes/doctor.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Doctor = require('../models/Doctor');

// 🩺 Doctor Registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, specialty } = req.body;

    if (await Doctor.findOne({ email })) {
      return res.status(400).json({ message: 'Doctor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = await Doctor.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      specialty,
    });

    res.status(201).json({ message: 'Doctor registered', doctor: newDoctor });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during doctor registration' });
  }
});

// ✅ GET all doctors (optionally filter by specialty)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.specialty) filter.specialty = req.query.specialty;

    const doctors = await Doctor.find(filter).select('-password');
    res.json(doctors);
  } catch (err) {
    console.error('❌ Error fetching doctors:', err.message);
    res.status(500).json({ message: 'Server error fetching doctors' });
  }
});

// ✅ Get doctor by email
router.get('/email/:email', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ email: req.params.email });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    console.error('❌ Error fetching doctor by email:', err.message);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});


// ✅ Optional: Get doctor by userId (only use if userId saved in Doctor)
router.get('/user/:userId', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    console.error('❌ Error fetching doctor by userId:', err.message);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
});

module.exports = router;
