
import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AdminAppointments() {
  const [summary, setSummary] = useState({ doctors: [], patients: [] });
  const reportRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/appointments-summary')
      .then(res => setSummary(res.data))
      .catch(err => console.error(err));
  }, []);

  const generatePDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('appointments-overview.pdf');
    });
  };

  return (
    <DashboardLayout userType="admin">
      <div className="max-w-5xl mx-auto bg-white shadow rounded p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Appointments Overview</h2>
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Generate Report
          </button>
        </div>

        <div ref={reportRef}>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Doctor Appointments</h3>
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Doctor Name</th>
                  <th className="p-2 border">Appointments</th>
                </tr>
              </thead>
              <tbody>
                {summary.doctors.map((d, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{d.name}</td>
                    <td className="p-2 border">{d.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Patient Appointments</h3>
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Patient Name</th>
                  <th className="p-2 border">Appointments</th>
                </tr>
              </thead>
              <tbody>
                {summary.patients.map((p, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{p.name}</td>
                    <td className="p-2 border">{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
