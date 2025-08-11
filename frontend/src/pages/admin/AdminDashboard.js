
// import React, { useEffect, useState } from 'react';
// import DashboardLayout from '../../layouts/DashboardLayout';
// import axios from 'axios';

// export default function AdminDashboard() {
//   const [counts, setCounts] = useState({ doctors: 0, patients: 0 });

//   useEffect(() => {
//     axios.get('http://localhost:8080/api/admin/counts')
//       .then(res => setCounts(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <DashboardLayout userType="admin">
//       <div className="max-w-4xl mx-auto bg-white shadow rounded p-6">
//         <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-blue-100 p-4 rounded">
//             <h3 className="text-lg font-semibold">Total Doctors</h3>
//             <p className="text-3xl">{counts.doctors}</p>
//           </div>
//           <div className="bg-green-100 p-4 rounded">
//             <h3 className="text-lg font-semibold">Total Patients</h3>
//             <p className="text-3xl">{counts.patients}</p>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981']; // Tailwind blue-500 and green-500

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ doctors: 0, patients: 0 });

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/counts')
      .then(res => setCounts(res.data))
      .catch(err => console.error(err));
  }, []);

  const chartData = [
    { name: 'Doctors', value: counts.doctors },
    { name: 'Patients', value: counts.patients },
  ];

  return (
    <DashboardLayout userType="admin">
      <div className="max-w-4xl mx-auto bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>

        {/* Count Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Total Doctors</h3>
            <p className="text-3xl">{counts.doctors}</p>
          </div>
          <div className="bg-green-100 p-4 rounded text-center">
            <h3 className="text-lg font-semibold">Total Patients</h3>
            <p className="text-3xl">{counts.patients}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="w-full h-80 bg-gray-50 rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
