import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../layouts/DashboardLayout';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    axios
      .get(`http://localhost:8080/api/appointments/patient/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error('Failed to load appointments', err));
  };

  const handleCancel = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Appointment cancelled');
      fetchAppointments();
    } catch (error) {
      console.error('Failed to cancel appointment', error);
      alert('Failed to cancel appointment');
    }
  };

  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate('');
    setSelectedSlot('');
    setAvailableSlots([]);
    setShowModal(true);
  };

  const fetchSlots = async (doctorId, date) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/availability/doctor/${doctorId}/date/${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableSlots(res.data);
    } catch (err) {
      console.error('Error fetching slots', err);
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (selectedAppointment?.doctorId?._id) {
      fetchSlots(selectedAppointment.doctorId._id, newDate);
    }
  };

  const handleReschedule = async (appointmentId, newDate, newTime) => {
    if (!newDate || !newTime) {
      alert('Please select both a date and a time slot.');
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/appointments/reschedule/${appointmentId}`,
        { date: newDate, time: newTime },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Appointment rescheduled successfully');
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      console.error('Failed to reschedule', err);
      if (err.response && err.response.status === 409) {
        alert('The selected slot is already booked. Please choose another.');
      } else {
        alert('Failed to reschedule appointment');
      }
    }
  };

  const renderTable = (title, data) => (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-2">{title}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()} appointments.</p>
      ) : (
        <table className="w-full text-left mb-4 border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Time</th>
              <th className="py-2 px-4">Doctor</th>
              <th className="py-2 px-4">Reason</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a) => (
              <tr key={a._id} className="border-b">
                <td className="py-2 px-4">{a.date}</td>
                <td className="py-2 px-4">{a.time}</td>
                <td className="py-2 px-4">
                  Dr. {a.doctorId?.firstName} {a.doctorId?.lastName}
                </td>
                <td className="py-2 px-4">{a.reason}</td>
                <td className="py-2 px-4">{a.computedStatus}</td>
                <td className="py-2 px-4 space-x-2">
                  {a.computedStatus === 'Upcoming' && (
                    <>
                      <button
                        onClick={() => handleCancel(a._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => openRescheduleModal(a)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  return (
    <DashboardLayout userType="patient">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">My Appointments</h2>
        {renderTable('Upcoming', appointments.filter(a => a.computedStatus === 'Upcoming'))}
        {renderTable('Finished', appointments.filter(a => a.computedStatus === 'Finished'))}
      </div>

      {/* Reschedule Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <label className="block mb-2 text-sm font-medium">Select New Date:</label>
            <input
              type="date"
              className="border rounded px-3 py-1 w-full mb-4"
              value={selectedDate}
              onChange={handleDateChange}
            />

            <label className="block mb-2 text-sm font-medium">Select Time Slot:</label>
            <select
              className="border rounded px-3 py-1 w-full mb-4"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
            >
              <option value="">-- Select Time --</option>
              {availableSlots.map((slot, index) => (
                <option key={index} value={slot.time}>
                  {slot.time}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() =>
                  handleReschedule(
                    selectedAppointment._id,
                    selectedDate,
                    selectedSlot
                  )
                }
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientAppointments;
