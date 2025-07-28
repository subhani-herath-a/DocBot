
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookAppointment = () => {
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [visibleDoctors, setVisibleDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
  axios.get('http://localhost:8080/api/doctors')
    .then(res => {
      console.log("✅ Doctors from backend:", res.data);
      setDoctors(res.data);
    })
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
    if (!selectedDoctor) return;
    axios.get(`http://localhost:8080/api/availability/doctor/${selectedDoctor}`)
      .then(res => {
        console.log('📬 Slots:', res.data);
        setSlots(res.data);
      })
      .catch(err => {
        console.error("❌ Failed to fetch slots:", err);
        setSlots([]);
      });
  }, [selectedDoctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return alert('Please select a time slot');

    const token = localStorage.getItem('token');
    if (!token) return alert('Not logged in');
    const patientId = JSON.parse(atob(token.split('.')[1])).id;

    const [date, time] = selectedSlot.split('|');

    try {
      await axios.post('http://localhost:8080/api/appointments', {
        patientId,
        doctorId: selectedDoctor,
        date,
        time,
        reason: 'Check-up',
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        await axios.post('http://localhost:8080/api/upload/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      alert('Appointment booked!');
    } catch (err) {
      console.error(err);
      alert('Booking failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <select required className="w-full p-2 border rounded"
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}>
          <option value="">-- Select Specialty --</option>
          {[...new Set(doctors.map(d => d.specialty))].map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>

        {visibleDoctors.length > 0 && (
          <select required className="w-full p-2 border rounded"
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}>
            <option value="">-- Select Doctor --</option>
            {visibleDoctors.map(d => (
              <option key={d._id} value={d._id}>
                Dr. {d.firstName} {d.lastName}
              </option>
            ))}
          </select>
        )}

        {selectedDoctor && slots.length === 0 && (
          <p className="text-red-500">No available slots found.</p>
        )}

        {slots.length > 0 && (
          <select required className="w-full p-2 border rounded"
            value={selectedSlot}
            onChange={e => setSelectedSlot(e.target.value)}>
            <option value="">-- Select Date & Time --</option>
            {slots.map((s, i) => (
              <option key={i} value={`${s.day}|${s.start}`}>
                {s.day} — {s.start} to {s.end}
              </option>
            ))}
          </select>
        )}

        {selectedSlot && (
          <>
            <input type="file" onChange={e => setFile(e.target.files[0])}
              className="w-full" accept="image/*,application/pdf" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Confirm Booking
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default BookAppointment;
