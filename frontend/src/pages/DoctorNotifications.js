// Path: frontend/src/pages/DoctorNotifications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const doctor = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!doctor?._id || !token) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/notifications/${doctor._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [doctor, token]);

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/notifications/mark-all-read/${doctor._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh notifications
      const res = await axios.get(`http://localhost:8080/api/notifications/${doctor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Notifications</h2>
        {unread.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {unread.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">🔵 Unread</h3>
              <ul className="space-y-3">
                {unread.map((n) => (
                  <li key={n._id} className="bg-yellow-100 p-4 rounded shadow border border-yellow-300">
                    <div className="font-medium">{n.message}</div>
                    <div className="text-sm text-gray-600">{new Date(n.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {read.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">⚪ Read</h3>
              <ul className="space-y-3">
                {read.map((n) => (
                  <li key={n._id} className="bg-gray-100 p-4 rounded shadow-sm border">
                    <div>{n.message}</div>
                    <div className="text-sm text-gray-500">{new Date(n.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {notifications.length === 0 && (
            <p className="text-gray-500">No notifications found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorNotifications;
