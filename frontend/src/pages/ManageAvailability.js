import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageAvailability = () => {
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [doctorId, setDoctorId] = useState('');

  // ✅ Get Doctor _id by email
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.email) return;

    axios.get(`http://localhost:8080/api/doctors/email/${user.email}`)
      .then(res => {
        setDoctorId(res.data._id); // ✅ correct doctor _id
        console.log('✅ Loaded doctor _id:', res.data._id);
      })
      .catch(err => {
        console.error('❌ Failed to load doctor _id:', err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doctorId || !date || !start || !end) {
      return alert('All fields are required');
    }

    try {
      await axios.post('http://localhost:8080/api/availability', {
        doctorId,
        day: date,
        start,
        end
      });
      alert('Availability saved!');
      setDate('');
      setStart('');
      setEnd('');
    } catch (err) {
      console.error('❌ Error saving availability:', err);
      alert('Failed to save availability');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="w-full border rounded p-2" required />
        <input type="time" value={start} onChange={e => setStart(e.target.value)}
          className="w-full border rounded p-2" required />
        <input type="time" value={end} onChange={e => setEnd(e.target.value)}
          className="w-full border rounded p-2" required />
        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Availability
        </button>
      </form>
    </div>
  );
};

export default ManageAvailability;
