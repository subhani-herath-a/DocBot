// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import DashboardLayout from '../../layouts/DashboardLayout';

// const DoctorRecords = () => {
//   const [records, setRecords] = useState([]);
//   const doctor = JSON.parse(localStorage.getItem('user'));
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     if (!doctor?._id || !token) return;

//     axios
//       .get(`http://localhost:8080/api/upload/doctor/${doctor._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => setRecords(res.data))
//       .catch((err) => console.error('Error fetching doctor records:', err));
//   }, [doctor, token]);

//   return (
//     <DashboardLayout userType="doctor">
//       <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
//         <h2 className="text-2xl font-bold mb-4">Uploaded Medical Records</h2>
//         {records.length === 0 ? (
//           <p className="text-gray-500">No records uploaded yet.</p>
//         ) : (
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-4">Filename</th>
//                 <th className="py-2 px-4">Uploaded At</th>
//                 <th className="py-2 px-4">Download</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.map((rec, idx) => (
//                 <tr key={idx} className="border-b">
//                   <td className="py-2 px-4">{rec.filename}</td>
//                   <td className="py-2 px-4">{new Date(rec.uploadedAt).toLocaleString()}</td>
//                   <td className="py-2 px-4">
//                     <a
//                       href={`http://localhost:8080/api/files/${rec.filename}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:underline"
//                     >
//                       Download
//                     </a>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default DoctorRecords;import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const DoctorRecords = () => {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [appointmentId, setAppointmentId] = useState('');
  const [appointments, setAppointments] = useState([]);
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

    axios
      .get(`http://localhost:8080/api/appointments/doctor/${doctor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const finishedAppointments = res.data.filter(a => a.computedStatus === 'Finished');
        setAppointments(finishedAppointments);
      })
      .catch((err) => console.error('Error fetching appointments:', err));
  }, [doctor, token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!appointmentId || !file) return alert('Please select an appointment and upload a file.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(
        `http://localhost:8080/api/records/upload/${appointmentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      alert('Record uploaded!');
      setFile(null);
      setAppointmentId('');
      // Reload records
      const recRes = await axios.get(`http://localhost:8080/api/upload/doctor/${doctor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(recRes.data);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload record.');
    }
  };

  return (
    <DashboardLayout userType="doctor">
      <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Uploaded Medical Records</h2>

        {/* Upload Section */}
        <form onSubmit={handleUpload} className="mb-8 space-y-4">
          <label className="block font-medium">Select Appointment:</label>
          <select
            value={appointmentId}
            onChange={e => setAppointmentId(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">-- Select Appointment --</option>
            {appointments.map(appt => (
              <option key={appt._id} value={appt._id}>
                {appt.date} at {appt.time} - {appt.patientId?.firstName} {appt.patientId?.lastName}
              </option>
            ))}
          </select>

          <label className="block font-medium">Upload File:</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={e => setFile(e.target.files[0])}
            className="w-full"
            required
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Upload Record
          </button>
        </form>

        {/* Records Table */}
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
