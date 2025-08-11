
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
   const doctorUser = JSON.parse(localStorage.getItem('user'));
  const doctorEmail = doctorUser?.email;


   useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // First get the doctor by email
        const doctorRes = await axios.get(`http://localhost:8080/api/doctors/email/${doctorEmail}`);
        const doctorId = doctorRes.data._id;

        const res = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}`);
        setAppointments(res.data);
      } catch (err) {
        console.error('❌ Error fetching appointments:', err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    if (doctorEmail) fetchAppointments();
  }, [doctorEmail]);

  return (
    <DashboardLayout userType="doctor">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Patient</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Status</th>
              <th className="p-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="p-2">{a.patientId?.firstName || 'N/A'} {a.patientId?.lastName || ''}</td>
                <td className="p-2">{a.date}</td>
                <td className="p-2">{a.time}</td>
                <td className="p-2">{a.status}</td>
                <td className="p-2">{a.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;
