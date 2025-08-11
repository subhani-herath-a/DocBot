
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { generateTimeSlots } from '../utils/time';

const ManageAvailability = () => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [existingSlots, setExistingSlots] = useState([]);
  const [creating, setCreating] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/availability/doctor/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExistingSlots(res.data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    }
  };

  const handleCreateSlots = async () => {
    if (!date || !startTime || !endTime) return;

    setCreating(true);
    const slots = generateTimeSlots(startTime, endTime);

    try {
      await axios.post(
        `http://localhost:8080/api/availability`,
        {
          doctorId: user._id,
          date,
          slots,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchAvailability();
      setDate('');
      setStartTime('');
      setEndTime('');
      setStep(1);
    } catch (err) {
      console.error('Slot creation failed:', err);
      alert('Slot creation failed.');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">

      {/* STEP-BY-STEP FORM */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Availability</h2>

        <form className="space-y-4">
          {step === 1 && (
            <>
              <label className="block font-medium mb-1">Select Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!date}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <label className="block font-medium mb-1">Select Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!startTime}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block font-medium mb-1">Select End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!endTime}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="text-gray-700">
                Confirm creating slots for <strong>{date}</strong> from{' '}
                <strong>{startTime}</strong> to <strong>{endTime}</strong>?
              </p>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCreateSlots}
                  disabled={creating}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Slots'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* EXISTING SLOTS */}
      <div className="bg-white shadow-xl rounded-2xl p-6 border">
        <h3 className="font-semibold mb-2 text-lg text-gray-800">Existing Slots</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {existingSlots.length > 0 ? (
            existingSlots.map((slot, idx) => (
              <div key={idx} className="bg-gray-100 p-2 rounded text-center text-sm">
                {slot.date} – {slot.time}
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No slots created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAvailability;
