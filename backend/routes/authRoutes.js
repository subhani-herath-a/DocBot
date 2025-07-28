const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, specialization } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save common user to User collection
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();

    // If doctor, save extra to Doctor collection
    if (role === 'doctor') {
      const doctorProfile = new Doctor({
        userId: newUser._id,
        name: `${firstName} ${lastName}`,
        email,
        specialization
      });
      await doctorProfile.save();
    }

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
