import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const user = JSON.parse(localStorage.getItem('user')); // user from "users" collection
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user?.email || !token) return;

    const fetchData = async () => {
      try {
        // ✅ Get doctor from doctors collection using email
        const doctorRes = await axios.get(
          `http://localhost:8080/api/doctors/email/${user.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const doctorId = doctorRes.data._id;

        // ✅ Get appointments using doctor._id
        const apptRes = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const appointmentsData = apptRes.data;
        setAppointments(appointmentsData);

        // ✅ Extract unique patients from appointments
        const uniquePatients = [];
        const seenPatientIds = new Set();
        appointmentsData.forEach((appt) => {
          if (appt.patientId && !seenPatientIds.has(appt.patientId._id)) {
            seenPatientIds.add(appt.patientId._id);
            uniquePatients.push(appt.patientId);
          }
        });

        setPatients(uniquePatients);
      } catch (err) {
        console.error('Error fetching doctor data:', err);
      }
    };

    fetchData();
  }, [user, token]);

  // ✅ Filter upcoming appointments
  const upcoming = appointments.filter((a) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${a.date}T${a.time}`);
    return a.status !== 'cancelled' && appointmentDateTime >= now;
  });

  return (
    <DashboardLayout userType="doctor">
      <div className="space-y-6 p-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to Your Doctor Dashboard</h2>
        <p className="text-gray-700">Track appointments and manage your assigned patients.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Upcoming Appointments</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{upcoming.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Assigned Patients</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{patients.length}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            onClick={() => (window.location.href = '/doctor/appointments')}
          >
            View Appointments
          </button>
          {/* <button
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            onClick={() => (window.location.href = '/doctor/patients')}
          >
            View Patients
          </button> */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
