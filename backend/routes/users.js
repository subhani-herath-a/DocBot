const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/doctors', verifyToken, async (req, res) => {
  const doctors = await User.find({ role: 'doctor' }).select('-password');
  res.json(doctors);
});

router.get('/patients', verifyToken, requireRole('doctor'), async (req, res) => {
  const patients = await User.find({ role: 'patient' }).select('-password');
  res.json(patients);
});

router.get('/all', verifyToken, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.post('/doctor', verifyToken, requireRole('admin'), async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: 'doctor' });
  res.status(201).json(user);
});

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      firstName,
      lastName,
      email,
      specialty,
      profilePicture,
      currentPassword,
      password: newPassword,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    if (newPassword) {
      const hashed = await bcrypt.hash(newPassword, 10);
      user.password = hashed;
    }

    await user.save();

    if (user.role === 'doctor' && specialty) {
      await Doctor.findOneAndUpdate({ userId: user._id }, { specialty });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
