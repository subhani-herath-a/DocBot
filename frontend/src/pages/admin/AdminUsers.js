import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState(null); // For modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:8080/api/users/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const nonAdmins = res.data.filter((u) => u.role !== 'admin');
        setUsers(nonAdmins);
      })
      .catch((err) => console.error('Error fetching users', err));
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredUsers = users
    .filter(
      (user) =>
        (filterRole === 'all' || user.role === filterRole) &&
        (`${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField].toLowerCase();
      const valB = b[sortField].toLowerCase();
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <DashboardLayout userType="admin">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray mb-4">
          Manage Users
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border px-3 py-1 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All Roles</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort('firstName')}
                >
                  Name{' '}
                  {sortField === 'firstName' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="p-2 text-left cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  Email{' '}
                  {sortField === 'email' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-700">
                  <td className="p-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() => openUserModal(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-4 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-600 rounded-lg p-6 w-96 shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-500 dark:text-white">
                User Details
              </h3>
              <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Phone:</strong> {selectedUser.phone }</p>
              <p><strong>Address:</strong> {selectedUser.address }</p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
