const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// Total doctors and patients
router.get('/counts', async (req, res) => {
  try {
    const doctors = await User.countDocuments({ role: 'doctor' });
    const patients = await User.countDocuments({ role: 'patient' });
    res.json({ doctors, patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Appointments summary
router.get('/appointments-summary', async (_req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId patientId');

    const doctorMap = {};
    const patientMap = {};

    appointments.forEach((appt) => {
      if (appt.doctorId) {
        const docId = appt.doctorId._id;
        doctorMap[docId] = doctorMap[docId] || {
          name: `${appt.doctorId.firstName} ${appt.doctorId.lastName}`,
          count: 0,
        };
        doctorMap[docId].count++;
      }

      if (appt.patientId) {
        const patId = appt.patientId._id;
        patientMap[patId] = patientMap[patId] || {
          name: `${appt.patientId.firstName} ${appt.patientId.lastName}`,
          count: 0,
        };
        patientMap[patId].count++;
      }
    });

    res.json({
      doctors: Object.values(doctorMap),
      patients: Object.values(patientMap),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
