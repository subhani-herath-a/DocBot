
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    notificationEmail: '',
    autoApproveDoctors: false,
    maintenanceMode: false,
  });

  // 🔄 Load saved settings (optional: use API later)
  useEffect(() => {
    // Simulate API fetch (you can replace with real API)
    const saved = JSON.parse(localStorage.getItem('docbot-admin-settings'));
    if (saved) setSettings(saved);
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Optional: Save to backend
      // await axios.post('http://localhost:8080/api/admin/settings', settings);

      // Save to localStorage (for now)
      localStorage.setItem('docbot-admin-settings', JSON.stringify(settings));

      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('Failed to save settings');
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray">System Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-800">
              System Notification Email
            </label>
            <input
              type="email"
              name="notificationEmail"
              value={settings.notificationEmail}
              onChange={handleChange}
              placeholder="admin@docbot.com"
              className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-gray-350 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            />
          </div>

          {/* Auto-Approve Doctors */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="autoApproveDoctors"
              checked={settings.autoApproveDoctors}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-gray-700 dark:text-gray-800">
              Auto-approve new doctor registrations
            </label>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-gray-700 dark:text-gray-800">
              Enable maintenance mode
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Save Settings
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
