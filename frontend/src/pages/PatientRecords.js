// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import DashboardLayout from '../components/DashboardLayout';

// const PatientRecords = () => {
//   const [records, setRecords] = useState([]);

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const user = JSON.parse(localStorage.getItem('user'));

//         const res = await axios.get(
//           `http://localhost:8080/api/files/patient/${user._id}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setRecords(res.data);
//       } catch (err) {
//         console.error('Error fetching records:', err);
//       }
//     };

//     fetchRecords();
//   }, []);

//   return (
//     <DashboardLayout userType="patient">
//       <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">My Medical Records</h2>

//         {records.length === 0 ? (
//           <p className="text-gray-600">No records found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="py-2 px-4 font-medium text-gray-600">Filename</th>
//                   <th className="py-2 px-4 font-medium text-gray-600">Uploaded At</th>
//                   <th className="py-2 px-4 font-medium text-gray-600">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {records.map((rec, idx) => (
//                   <tr key={idx} className="border-b">
//                     <td className="py-2 px-4">{rec.filename}</td>
//                     <td className="py-2 px-4">
//                       {new Date(rec.uploadedAt).toLocaleString()}
//                     </td>
//                     <td className="py-2 px-4">
//                       <a
//                         href={`http://localhost:8080/${rec.filepath}`}
//                         className="text-blue-600 hover:underline"
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         Download
//                       </a>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default PatientRecords;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

const PatientRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/upload/records', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(res.data);
      } catch (err) {
        console.error('Error fetching records:', err);
      }
    };

    fetchRecords();
  }, []);

  return (
    <DashboardLayout userType="patient">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Medical Records</h2>

        {records.length === 0 ? (
          <p className="text-gray-600">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 font-medium text-gray-600">Filename</th>
                  <th className="py-2 px-4 font-medium text-gray-600">Upload Date</th>
                  <th className="py-2 px-4 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-4">{rec.filename}</td>
                    <td className="py-2 px-4">{new Date(rec.uploadedAt).toLocaleString()}</td>
                    <td className="py-2 px-4">
                      <a
                        href={`http://localhost:8080/api/upload/${rec.filename}`}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientRecords;
