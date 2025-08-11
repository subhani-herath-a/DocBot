
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  phone:      { type: String },
  address:    { type: String },
  dob:        { type: Date },
  role:       { type: String, enum: ['admin', 'doctor', 'patient'], required: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);