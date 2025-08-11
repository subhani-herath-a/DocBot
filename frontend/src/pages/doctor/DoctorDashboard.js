
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const doctor = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!doctor?._id || !token) return;

    axios
      .get(`http://localhost:8080/api/appointments/doctor/${doctor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error('Appointments error:', err));

    axios
      .get(`http://localhost:8080/api/users/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPatients(res.data))
      .catch((err) => console.error('Patients error:', err));
  }, [doctor, token]);

  const upcoming = appointments.filter((a) => a.status !== 'cancelled');

  return (
    <DashboardLayout userType="doctor">
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Doctor Dashboard</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
            <p className="text-2xl">{upcoming.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Assigned Patients</h3>
            <p className="text-2xl">{patients.length}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
