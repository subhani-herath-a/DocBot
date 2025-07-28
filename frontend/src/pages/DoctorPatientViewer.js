// import React, { useEffect, useState } from 'react';

// function DoctorPatientViewer() {
//   const [patients, setPatients] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:8080/api/users/patients', {
//       headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
//     })
//       .then(res => res.json())
//       .then(setPatients);
//   }, []);

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl mb-4">My Patients</h2>
//       <ul>
//         {patients.map(p => (
//           <li key={p._id} className="mb-2 border-b pb-2">
//             <h3 className="font-semibold">{p.name}</h3>
//             <p>{p.email}</p>
//             <a className="text-blue-600" href={`mailto:${p.email}`}>Contact</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default DoctorPatientViewer;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

const DoctorPatientViewer = () => {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const doctor = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!doctor?._id || !token) return;

    axios
      .get(`http://localhost:8080/api/upload/doctor/${doctor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRecords(res.data))
      .catch((err) => console.error('Error loading records:', err));
  }, [doctor, token]);

  const handleUpload = async (e, patientId) => {
    e.preventDefault();
    if (!file) return alert('No file selected');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doctorId', doctor._id);
    formData.append('patientId', patientId);

    try {
      await axios.post('http://localhost:8080/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Record uploaded');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <DashboardLayout userType="doctor">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Patient Medical Records</h2>
        {records.map((r) => (
          <div key={r._id} className="border p-4 rounded mb-3">
            <p className="font-semibold">{r.filename}</p>
            <p className="text-sm text-gray-600">
              Patient: {r.patientId?.firstName} {r.patientId?.lastName}
            </p>
            <a
              href={`http://localhost:8080/api/files/${r.filename}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View/Download
            </a>
          </div>
        ))}

        <form className="mt-6">
          <label className="block mb-2">Upload New Record:</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded"
            onClick={(e) => handleUpload(e, records[0]?.patientId?._id)}
          >
            Upload to First Patient
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DoctorPatientViewer;

