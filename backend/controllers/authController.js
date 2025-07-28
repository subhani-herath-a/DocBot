const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, role, specialty } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ STEP 1: Create user first
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    // ✅ STEP 2: If doctor, create Doctor with full info
    if (role === 'doctor') {
      await Doctor.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        specialty
      });
    }

    res.status(201).json({ msg: 'Registered successfully', user });
  } catch (err) {
    console.error("❌ Registration failed:", err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.json({ token, user });
  } catch (err) {
    console.error("❌ Login failed:", err);
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};
