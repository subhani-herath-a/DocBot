import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminReports = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/files/records', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <DashboardLayout userType="admin">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Uploaded Medical Reports
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading reports...</p>
        ) : records.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No reports found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
                <tr>
                  <th className="px-4 py-2 text-left">File Name</th>
                  <th className="px-4 py-2 text-left">Uploaded On</th>
                  <th className="px-4 py-2 text-left">Download</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 dark:text-gray-200">
                {records.map((file, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2">{file.filename}</td>
                    <td className="px-4 py-2">{new Date(file.uploadDate).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <a
                        href={`http://localhost:8080/uploads/${file.filename}`}
                        download
                        className="text-blue-600 hover:underline"
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

export default AdminReports;
