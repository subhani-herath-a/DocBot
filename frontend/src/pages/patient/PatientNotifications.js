import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/notifications/${user._id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/mark-all-read/${user._id}`);
      const res = await axios.get(`http://localhost:8080/api/notifications/${user._id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error marking notifications as read', err);
    }
  };

  return (
    <DashboardLayout userType="patient">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>

        <button
          onClick={markAllAsRead}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Mark All as Read
        </button>

        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications available.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((note) => (
              <li key={note._id} className="py-3">
                <div className="flex justify-between items-center">
                  <p className={note.read ? 'text-gray-600' : 'text-black font-semibold'}>
                    {note.message}
                  </p>
                  <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientNotifications;
