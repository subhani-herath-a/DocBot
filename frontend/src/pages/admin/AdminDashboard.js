
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ doctors: 0, patients: 0 });

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/counts')
      .then(res => setCounts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout userType="admin">
      <div className="max-w-4xl mx-auto bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Total Doctors</h3>
            <p className="text-3xl">{counts.doctors}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Total Patients</h3>
            <p className="text-3xl">{counts.patients}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
