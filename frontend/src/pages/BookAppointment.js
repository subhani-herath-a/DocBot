import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookAppointment = () => {
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [visibleDoctors, setVisibleDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [file, setFile] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    axios.get('http://localhost:8080/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error("❌ Error fetching doctors:", err));
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doc => doc.specialty === specialty);
    setVisibleDoctors(filtered);
    setSelectedDoctor('');
    setSlots([]);
    setSelectedSlot('');
  }, [specialty, doctors]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    axios.get(`http://localhost:8080/api/availability/doctor/${selectedDoctor}/date/${selectedDate}`)
      .then(res => setSlots(res.data))
      .catch(err => {
        console.error("❌ Failed to fetch slots:", err);
        setSlots([]);
      });
  }, [selectedDoctor, selectedDate]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedSlot) return alert('Please select a time slot');

  const token = localStorage.getItem('token');
  if (!token) return alert('Not logged in');
  const patientId = JSON.parse(atob(token.split('.')[1])).id;
  const [date, time] = selectedSlot.split('|');

  const formData = new FormData();
  formData.append('patientId', patientId);
  formData.append('doctorId', selectedDoctor);
  formData.append('date', date);
  formData.append('time', time);
  formData.append('reason', 'Check-up');
  if (file) formData.append('file', file);

  try {
    await axios.post(
      'http://localhost:8080/api/appointments',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    alert('Appointment booked!');
    setStep(1);
    setSpecialty('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedSlot('');
    setFile(null);
  } catch (err) {
    console.error('❌ Booking error:', err);
    alert('Booking failed: ' + (err.response?.data?.message || err.message));
  }
};


  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white shadow-xl rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Book Appointment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <label className="block font-medium">Select Specialty</label>
              <select required value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="w-full p-2 border rounded">
                <option value="">-- Select Specialty --</option>
                {[...new Set(doctors.map(d => d.specialty))].map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
              <button type="button" disabled={!specialty}
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="block font-medium">Select Doctor</label>
              <select required value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                className="w-full p-2 border rounded">
                <option value="">-- Select Doctor --</option>
                {visibleDoctors.map(d => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.firstName} {d.lastName}
                  </option>
                ))}
              </select>
              <div className="flex justify-between gap-2">
                <button type="button" onClick={() => setStep(1)}
                  className="w-1/2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500">
                  Back
                </button>
                <button type="button" disabled={!selectedDoctor}
                  onClick={() => setStep(3)}
                  className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block font-medium">Select Date</label>
              <input type="date" required
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded" />
              <div className="flex justify-between gap-2">
                <button type="button" onClick={() => setStep(2)}
                  className="w-1/2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500">
                  Back
                </button>
                <button type="button" disabled={!selectedDate}
                  onClick={() => setStep(4)}
                  className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                  Next
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <label className="block font-medium">Select Time Slot</label>
              {slots.length === 0 ? (
                <p className="text-red-500">No slots available for selected date.</p>
              ) : (
                <select required value={selectedSlot}
                  onChange={e => setSelectedSlot(e.target.value)}
                  className="w-full p-2 border rounded">
                  <option value="">-- Select Time Slot --</option>
                  {slots.map((s, i) => (
                    <option key={i} value={`${s.date}|${s.time}`}>
                      {s.time}
                    </option>
                  ))}
                </select>
              )}
              <div className="flex justify-between gap-2">
                <button type="button" onClick={() => setStep(3)}
                  className="w-1/2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500">
                  Back
                </button>
                <button type="button" disabled={!selectedSlot}
                  onClick={() => setStep(5)}
                  className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                  Next
                </button>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <label className="block font-medium">Upload File (optional)</label>
              <input type="file"
                accept="image/*,application/pdf"
                onChange={e => setFile(e.target.files[0])}
                className="w-full" />
              <div className="flex justify-between gap-2 mt-4">
                <button type="button" onClick={() => setStep(4)}
                  className="w-1/2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500">
                  Back
                </button>
                <button type="submit"
                  className="w-1/2 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Confirm Booking
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
