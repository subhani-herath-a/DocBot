import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

const DoctorRecords = () => {
  const [records, setRecords] = useState([]);
  const doctor = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!doctor?._id || !token) return;

    axios
      .get(`http://localhost:8080/api/upload/doctor/${doctor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecords(res.data))
      .catch((err) => console.error('Error fetching doctor records:', err));
  }, [doctor, token]);

  return (
    <DashboardLayout userType="doctor">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Uploaded Medical Records</h2>
        {records.length === 0 ? (
          <p className="text-gray-500">No records uploaded yet.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Filename</th>
                <th className="py-2 px-4">Uploaded At</th>
                <th className="py-2 px-4">Download</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-4">{rec.filename}</td>
                  <td className="py-2 px-4">{new Date(rec.uploadedAt).toLocaleString()}</td>
                  <td className="py-2 px-4">
                    <a
                      href={`http://localhost:8080/api/files/${rec.filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorRecords;