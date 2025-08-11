
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DoctorAvailability = () => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Get doctor ID and fetch availability
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.email) return;

    axios
      .get(`http://localhost:8080/api/doctors/email/${user.email}`)
      .then((res) => {
        const id = res.data._id;
        setDoctorId(id);
        fetchAvailability(id);
      })
      .catch((err) => console.error('❌ Failed to load doctor ID:', err));
  }, []);

  const fetchAvailability = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/availability/doctor/${id}`);
      setAvailableSlots(res.data);
    } catch (err) {
      console.error('❌ Failed to load availability:', err);
    }
  };

  const handleSubmit = async () => {
    if (!doctorId || !date || !start || !end) {
      alert('All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/availability', {
        doctorId,
        day: date,
        start,
        end,
      });

      alert('✅ Availability saved!');
      setDate('');
      setStart('');
      setEnd('');
      setStep(1);
      fetchAvailability(doctorId);
    } catch (err) {
      console.error('❌ Error saving availability:', err);
      alert('Failed to save availability');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Delete this slot?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/availability/${slotId}`);
      fetchAvailability(doctorId);
    } catch (err) {
      console.error('❌ Failed to delete slot:', err);
    }
  };

  const tileClassName = ({ date }) => {
    const calendarDate = date.toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
    const hasSlot = availableSlots.some((s) => (s.day || s.date) === calendarDate);
    return hasSlot ? 'react-calendar__tile--active bg-green-100 rounded-lg' : '';
  };

  const slotsForSelectedDate = availableSlots.filter(
    (s) => (s.day || s.date) === (selectedDate ? selectedDate.toLocaleDateString('en-CA') : '')
  );

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Availability Form */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Availability</h2>

        {step === 1 && (
          <>
            <div>
              <label className="block font-medium mb-1">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!date}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block font-medium mb-1">Start Time</label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!start}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="block font-medium mb-1">End Time</label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!end || submitting}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Availability'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Calendar + Slots */}
      <div className="bg-white p-6 rounded-2xl shadow-xl border">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Dates</h3>
        <Calendar
          tileClassName={tileClassName}
          className="w-full border-none text-sm"
          onClickDay={(value) => setSelectedDate(value)}
        />
        <p className="mt-2 text-sm text-gray-600">
          Calendar shows only the dates you've added availability for.
        </p>
      </div>
    </div>
  );
};

export default DoctorAvailability;
