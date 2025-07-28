import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

const PatientProfileSettings = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPatient = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setFormData((prev) => ({
          ...prev,
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
        }));
        setPreviewUrl(res.data.profilePicture || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient info:', err);
        setLoading(false);
      }
    };

    fetchPatient();
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      return alert('Please enter your current password to save changes.');
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return alert('New password and confirm password do not match.');
    }

    const updateData = {
      currentPassword: formData.currentPassword,
    };

    if (formData.firstName) updateData.firstName = formData.firstName;
    if (formData.lastName) updateData.lastName = formData.lastName;
    if (formData.email) updateData.email = formData.email;
    if (formData.newPassword) updateData.password = formData.newPassword;

    try {
      if (profilePic) {
        const imgForm = new FormData();
        imgForm.append('file', profilePic);
        const res = await axios.post('http://localhost:8080/api/upload/file', imgForm);
        updateData.profilePicture = res.data.filePath;
      }

      await axios.put(`http://localhost:8080/api/users/${userId}`, updateData);
      alert('Profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
        currentPassword: '',
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="patient">
        <div className="p-6">Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="patient">
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Patient Profile Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Pic */}
          <div className="flex items-center space-x-4">
            <img
              src={previewUrl || 'https://via.placeholder.com/80'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-500">Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-white"
              placeholder="Required to save any changes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
              placeholder="Leave blank to keep current"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          >
            Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfileSettings;
