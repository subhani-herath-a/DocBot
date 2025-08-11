// import React, { useEffect, useState } from 'react';

// const PatientRecordViewer = () => {
// const [files, setFiles] = useState([]);
// // const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const fetchRecords = async () => {
//       const token = localStorage.getItem('token');
//       const res = await fetch('http://localhost:8080/api/files/records', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setFiles(data);
//     };

//     fetchRecords();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">My Medical Records</h2>
//       <ul className="space-y-2">
//         {files.map((file, i) => (
//           <li key={i} className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
//             <span className="text-gray-700 dark:text-gray-200">{file.filename}</span>
//             <a
//               href={`http://localhost:8080/api/files/${file.filename}`}
//               className="ml-4 text-blue-600 hover:underline"
//               download
//             >
//               Download
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PatientRecordViewer;
import React, { useEffect, useState } from 'react';

const PatientRecordViewer = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/files/records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecords(data);
    };

    fetchRecords();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Medical Records</h2>
      {records.length === 0 ? (
        <p>No medical records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((rec, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Doctor:</strong> {rec.doctorId?.firstName || 'N/A'} {rec.doctorId?.lastName || ''}
                    {' '}({rec.doctorId?.specialty || 'General'})
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Appointment:</strong> {rec.appointmentId?.date || 'N/A'} at {rec.appointmentId?.time || ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Uploaded At:</strong> {new Date(rec.uploadedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Type:</strong> {rec.type === 'doctor-upload' ? 'Doctor' : 'Patient'}
                  </p>
                </div>
                <div>
                  <a
                    href={`http://localhost:8080${rec.filepath}`}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download: {rec.filename}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRecordViewer;

