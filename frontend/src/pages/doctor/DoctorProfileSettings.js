
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';

const DoctorProfileSettings = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: '',
    newPassword: '',
    confirmPassword: '',
    currentPassword: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setFormData((prev) => ({
          ...prev,
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          email: res.data.email || '',
          specialty: res.data.specialty || '',
        }));
        setPreviewUrl(res.data.profilePicture || '');
        setLoading(false);
      } catch (err) {
        console.error('Error loading doctor info:', err);
        setLoading(false);
      }
    };

    fetchDoctor();
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
      return alert("Please enter your current password to save changes");
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return alert("New password and confirm password do not match");
    }

    const updateData = {
      currentPassword: formData.currentPassword,
    };

    if (formData.firstName) updateData.firstName = formData.firstName;
    if (formData.lastName) updateData.lastName = formData.lastName;
    if (formData.email) updateData.email = formData.email;
    if (formData.specialty) updateData.specialty = formData.specialty;
    if (formData.newPassword) updateData.password = formData.newPassword;

    try {
      if (profilePic) {
        const imgForm = new FormData();
        imgForm.append('file', profilePic);
        const res = await axios.post('http://localhost:8080/api/upload/file', imgForm);
        updateData.profilePicture = res.data.filePath;
      }

      await axios.put(`http://localhost:8080/api/users/${userId}`, updateData);
      alert('Profile updated successfully');
      setFormData({ ...formData, newPassword: '', confirmPassword: '', currentPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="doctor">
        <div className="p-6">Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="doctor">
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Doctor Profile Settings</h2>

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
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
            />
          </div>

          {user?.role === 'doctor' && (
            <div>
              <label className="block text-sm font-medium">Specialty</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-red-500">Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              placeholder="Leave blank to keep current"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full p-2 border rounded"
              placeholder="Re-enter new password"
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfileSettings;
