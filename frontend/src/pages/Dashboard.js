import React from 'react';

function Dashboard() {
  const role = localStorage.getItem('role');
  return (
    <div className="p-8 ">
      <h2 className="text-2xl mb-4">Welcome to your {role} dashboard</h2>
      <p>This is where you’ll manage appointments, records, and more depending on your role.</p>
    </div>
  );
}

export default Dashboard;
