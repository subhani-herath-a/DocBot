import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`http://localhost:8080/api/appointments/patient/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error('Error fetching appointments', err));

    axios
      .get('http://localhost:8080/api/upload/records', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecords(res.data))
      .catch((err) => console.error('Error fetching records', err));
  }, [user, token]);

  // const upcoming = appointments.filter((a) => a.status !== 'cancelled');
  const upcoming = appointments.filter((a) => {
  const now = new Date();
  const appointmentDateTime = new Date(`${a.date}T${a.time}`);
  return a.status !== 'cancelled' && appointmentDateTime >= now;
});


  return (
    <DashboardLayout userType="patient">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Patient Dashboard</h2>
        <p className="text-gray-700">
          Manage appointments, view medical records, and access health services.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Upcoming Appointments</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{upcoming.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Medical Records</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{records.length}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            onClick={() => (window.location.href = "/book")}
          >
            Book Appointment
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            onClick={() => (window.location.href = "/records")}
          >
            View Medical Records
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
