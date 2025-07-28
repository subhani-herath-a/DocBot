
import React, { useState } from 'react';
import chatbotIcon from '../assets/chatbot_icon.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, } = formData;

    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password}, { withCredentials: true });
      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate based on role
      if (user.role === 'patient') navigate('/patient');
      else if (user.role === 'doctor') navigate('/doctor');
      else if (user.role === 'admin') navigate('/admin');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.msg || err.message));
    }
  };

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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Welcome Back</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="mt-1 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="mt-1 w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">I am a</label>
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
              <option value="admin">Administrator</option>
            </select>
          </div> 

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
