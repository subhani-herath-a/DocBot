import React, { useEffect, useState } from 'react';

const PatientRecordViewer = () => {
const [files, setFiles] = useState([]);
// const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/files/records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFiles(data);
    };

    fetchRecords();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Medical Records</h2>
      <ul className="space-y-2">
        {files.map((file, i) => (
          <li key={i} className="bg-gray-100 dark:bg-gray-800 p-3 rounded">
            <span className="text-gray-700 dark:text-gray-200">{file.filename}</span>
            <a
              href={`http://localhost:8080/api/files/${file.filename}`}
              className="ml-4 text-blue-600 hover:underline"
              download
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientRecordViewer;
