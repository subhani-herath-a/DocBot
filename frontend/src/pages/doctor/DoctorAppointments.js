
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doctorUser = JSON.parse(localStorage.getItem('user'));
  const doctorEmail = doctorUser?.email;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!token) throw new Error('No authentication token found');
        const doctorRes = await axios.get(`http://localhost:8080/api/doctors/email/${doctorEmail}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const doctorId = doctorRes.data._id;
        const res = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('❌ Error fetching appointments:', err);
        setError('Failed to load appointments. Please log in again or try later.');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    if (doctorEmail && token) fetchAppointments();
  }, [doctorEmail, token]);

  const filteredAppointments = appointments.filter((a) => {
    const name = `${a.patientId?.firstName || ''} ${a.patientId?.lastName || ''}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const upcoming = filteredAppointments.filter((a) => a.computedStatus === 'Upcoming');
  const finished = filteredAppointments.filter((a) => a.computedStatus === 'Finished');

  const renderTable = (title, data) => {
    return (
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {data.length === 0 ? (
          <p>No {title.toLowerCase()} available.</p>
        ) : (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">File</th>
                {/* <th className="p-2 border">Upload</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="p-2 border">{a.patientId?.firstName || 'N/A'} {a.patientId?.lastName || ''}</td>
                  <td className="p-2 border">{a.date}</td>
                  <td className="p-2 border">{a.time}</td>
                  <td className="p-2 border">{a.computedStatus}</td>
                  <td className="p-2 border">{a.reason || 'N/A'}</td>
                  <td className="p-2 border">
                    {a.fileUrl ? (
                      <a href={`http://localhost:8080${a.fileUrl}`} download target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        Download File
                      </a>
                    ) : (
                      <span className="text-gray-400">No File</span>
                    )}
                  </td>
                  {/* <td className="p-2 border">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData();
                        formData.append('file', e.target.file.files[0]);
                        const res = await fetch(`http://localhost:8080/records/upload/${a._id}`, {
                          method: 'POST',
                          body: formData,
                        });
                        const result = await res.json();
                        if (res.ok) {
                          alert('Record uploaded!');
                        } else {
                          alert('Upload failed: ' + result.message);
                        }
                      }}
                    >
                      <input type="file" name="file" accept="application/pdf,image/*" required />
                      <button type="submit" className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">
                        Upload
                      </button>
                    </form>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout userType="doctor">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Appointments</h2>
        <input
          type="text"
          placeholder="Search by patient name..."
          className="border p-2 mb-4 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <p>Loading appointments...</p>
        ) : (
          <>
            {renderTable('Upcoming Appointments', upcoming)}
            {renderTable('Finished Appointments', finished)}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointments;
