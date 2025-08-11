
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import DashboardLayout from '../../layouts/DashboardLayout';

// const DoctorPatientViewer = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [search, setSearch] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const doctorUser = JSON.parse(localStorage.getItem('user'));
//   const doctorEmail = doctorUser?.email;
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         if (!token || !doctorEmail) throw new Error('Missing doctor credentials');

//         // Fetch doctorId from doctors collection using email
//         const doctorRes = await axios.get(
//           `http://localhost:8080/api/doctors/email/${doctorEmail}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const doctorId = doctorRes.data._id;

//         // Fetch appointments
//         const res = await axios.get(
//           `http://localhost:8080/api/appointments/doctor/${doctorId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setAppointments(res.data);
//       } catch (err) {
//         console.error('Error loading appointments:', err);
//         setError('Failed to load appointments');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, [doctorEmail, token]);

//   const filteredAppointments = appointments.filter((a) => {
//     const name = `${a.patientId?.firstName || ''} ${a.patientId?.lastName || ''}`.toLowerCase();
//     return name.includes(search.toLowerCase());
//   });

//   return (
//     <DashboardLayout userType="doctor">
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-4">Patient Records by Appointment</h2>

//         <input
//           type="text"
//           placeholder="Search by patient name..."
//           className="border p-2 mb-4 w-full"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         {error && <p className="text-red-500">{error}</p>}
//         {loading ? (
//           <p>Loading appointments...</p>
//         ) : (
//           filteredAppointments.map((a) => (
//             <div key={a._id} className="border rounded-lg p-4 mb-4 bg-white shadow">
//               <p className="font-semibold">
//                 Patient: {a.patientId?.firstName} {a.patientId?.lastName}
//               </p>
//               <p className="text-sm">Appointment: {a.date} at {a.time}</p>

//               <div className="mt-2 text-sm">
//                 {a.fileUrl ? (
//                   <a
//                     href={`http://localhost:8080${a.fileUrl}`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-blue-600 underline"
//                   >
//                     View/Download Uploaded File
//                   </a>
//                 ) : (
//                   <span className="text-gray-500">No File</span>
//                 )}
//               </div>

//               <form
//                 className="mt-4"
//                 onSubmit={async (e) => {
//                   e.preventDefault();
//                   const file = e.target.file.files[0];
//                   if (!file) return alert('Please select a file first.');

//                   const formData = new FormData();
//                   formData.append('file', file);

//                   const res = await fetch(`http://localhost:8080/records/upload/${a._id}`, {
//                     method: 'POST',
//                     headers: {
//                       Authorization: `Bearer ${token}`,
//                     },
//                     body: formData,
//                   });

//                   const result = await res.json();

//                   if (res.ok) {
//                     alert('Record uploaded! ✅');

//                     // ✅ Send notification to patient
//                     await fetch('http://localhost:8080/api/notifications', {
//                       method: 'POST',
//                       headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`
//                       },
//                       body: JSON.stringify({
//                         userId: a.patientId._id,
//                         message: `Dr. ${doctorUser.firstName} ${doctorUser.lastName} uploaded a new medical record for your appointment on ${a.date}.`
//                       })
//                     });

//                   } else {
//                     alert('Upload failed ❌: ' + result.message);
//                   }
//                 }}
//               >
//                 <input
//                   type="file"
//                   name="file"
//                   accept="application/pdf,image/*"
//                   className="mb-2"
//                   required
//                 />
//                 <button
//                   type="submit"
//                   className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
//                 >
//                   Upload Post-Consultation Record
//                 </button>
//               </form>
//             </div>
//           ))
//         )}
//       </div>
//     </DashboardLayout>
//   );
// };

// export default DoctorPatientViewer;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const DoctorPatientViewer = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const doctorUser = JSON.parse(localStorage.getItem('user'));
  const doctorEmail = doctorUser?.email;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!token || !doctorEmail) throw new Error('Missing doctor credentials');

        // Fetch doctorId from doctors collection using email
        const doctorRes = await axios.get(
          `http://localhost:8080/api/doctors/email/${doctorEmail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const doctorId = doctorRes.data._id;

        // Fetch appointments (with populated patient info)
        const res = await axios.get(
          `http://localhost:8080/api/appointments/doctor/${doctorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAppointments(res.data);
      } catch (err) {
        console.error('Error loading appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorEmail, token]);

  const filteredAppointments = appointments.filter((a) => {
    const name = `${a.patientId?.firstName || ''} ${a.patientId?.lastName || ''}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  // Helper: calculate age from dob
  const getAge = (dob) => {
    if (!dob) return null;
    const diffMs = Date.now() - new Date(dob).getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
  };

  return (
    <DashboardLayout userType="doctor">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Patient Records by Appointment</h2>

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
          filteredAppointments.map((a) => (
            <div key={a._id} className="border rounded-lg p-4 mb-4 bg-white shadow">
              <p className="font-semibold">
                Patient: {a.patientId?.firstName} {a.patientId?.lastName}
              </p>

              {/* ✅ Show Phone */}
              {a.patientId?.phone && (
                <p className="text-sm">Phone: {a.patientId.phone}</p>
              )}

              {/* ✅ Show Age */}
              {a.patientId?.dob && (
                <p className="text-sm">Age: {getAge(a.patientId.dob)} years</p>
              )}

              <p className="text-sm">Appointment: {a.date} at {a.time}</p>

              <div className="mt-2 text-sm">
                {a.fileUrl ? (
                  <a
                    href={`http://localhost:8080${a.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View/Download Uploaded File
                  </a>
                ) : (
                  <span className="text-gray-500">No File</span>
                )}
              </div>

              <form
                className="mt-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const file = e.target.file.files[0];
                  if (!file) return alert('Please select a file first.');

                  const formData = new FormData();
                  formData.append('file', file);

                  const res = await fetch(`http://localhost:8080/records/upload/${a._id}`, {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                  });

                  const result = await res.json();

                  if (res.ok) {
                    alert('Record uploaded! ✅');

                    // ✅ Send notification to patient
                    await fetch('http://localhost:8080/api/notifications', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        userId: a.patientId._id,
                        message: `Dr. ${doctorUser.firstName} ${doctorUser.lastName} uploaded a new medical record for your appointment on ${a.date}.`
                      })
                    });

                  } else {
                    alert('Upload failed ❌: ' + result.message);
                  }
                }}
              >
                <input
                  type="file"
                  name="file"
                  accept="application/pdf,image/*"
                  className="mb-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                >
                  Upload Post-Consultation Record
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorPatientViewer;
