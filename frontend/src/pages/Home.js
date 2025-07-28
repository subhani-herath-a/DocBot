import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, CalendarDays, Stethoscope } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    const user = JSON.parse(localStorage.getItem('docbotUser'));
    if (user && user.role === 'patient') {
      navigate('/book');
    } else {
      alert('Please log in as a patient to book an appointment.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-400 px-6 py-20">
      <div className="max-w-4xl text-center">
        <div className="flex justify-center mb-6">
          <HeartPulse className="w-16 h-16 text-blue-600 animate-pulse" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-500">DocBot</span>
        </h1>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
          Your smart healthcare assistant — book appointments, manage medical records,
          and get 24/7 AI-powered health support. Fast, secure, and always available.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleBookAppointment}
            className="flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <CalendarDays className="h-5 w-5" />
            Book Appointment
          </button>

          <Link to="/login">
            <button className="flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              <Stethoscope className="h-5 w-5" />
              Login to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
