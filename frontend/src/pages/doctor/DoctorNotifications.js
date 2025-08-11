import React, { useEffect, useState } from 'react';
import axios from 'axios';


const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const doctorEmail = user?.email;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!doctorEmail || !token) return;

        // Get doctor ID from doctor collection by email
        const doctorRes = await axios.get(`http://localhost:8080/api/doctors/email/${doctorEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const doctorId = doctorRes.data._id;

        // Fetch notifications for doctor ID
        const res = await axios.get(`http://localhost:8080/api/notifications/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setNotifications(res.data);
      } catch (err) {
        console.error('❌ Error fetching notifications:', err);
        setError('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [doctorEmail, token]);

  const markAllAsRead = async () => {
    try {
      const doctorRes = await axios.get(`http://localhost:8080/api/doctors/email/${doctorEmail}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const doctorId = doctorRes.data._id;

      await axios.put(
        `http://localhost:8080/api/notifications/mark-all-read/${doctorId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Re-fetch notifications
      const res = await axios.get(`http://localhost:8080/api/notifications/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(res.data);
    } catch (err) {
      console.error('❌ Failed to mark as read:', err);
      alert('Could not mark notifications as read.');
    }
  };

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  return (
   
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Notifications
            {unread.length > 0 && (
              <span className="bg-red-600 text-white px-2 py-0.5 text-xs rounded-full">
                {unread.length}
              </span>
            )}
          </h2>
          {unread.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading notifications...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-600">No notifications found.</p>
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
          </>
        )}
      </div>
   
  );
};

export default DoctorNotifications;
