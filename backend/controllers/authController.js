
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

exports.register = async (req, res) => {
  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    role, 
    specialty, 
    phone, 
    address, 
    dob 
  } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create User with all provided fields
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      dob: dob ? new Date(dob) : null
    });

    // ✅ If Doctor, create in Doctor collection with same fields
    if (role === 'doctor') {
      await Doctor.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        specialty,
        phone,
        address,
        dob: dob ? new Date(dob) : null
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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("❌ Login failed:", err);
    res.status(500).json({ msg: 'Login failed', error: err.message });
  }
};
