import React, { useState } from 'react';
import chatbotIcon from '../assets/chatbot_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    specialty: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };

      // remove specialty if not a doctor
      if (payload.role !== 'doctor') delete payload.specialty;

      const res = await axios.post('http://localhost:8080/api/auth/register', payload);
      console.log(res.data);
      alert('Registration successful');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed: ' + (err.response?.data?.msg || err.message));
    }
  };

  const specialties = [
    'Cardiologist',
    'Physiotherapist',
    'Neurologist',
    'Dermatologist',
    'Psychiatrist',
    'General Practitioner',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-400 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-2">
            <button className="bg-blue-400 text-white rounded-full w-14 h-14 text-2xl shadow-lg">
              <img
                src={chatbotIcon}
                alt="Chatbot Icon"
                style={{ width: 60, height: 60, borderRadius: '50%' }}
              />
            </button>
            <span className="text-2xl font-bold text-gray-900 dark:text-white ml-2">DocBot</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create Account</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">Join our healthcare platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select user type</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === 'doctor' && (
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Specialty</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select specialty</option>
                {specialties.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
