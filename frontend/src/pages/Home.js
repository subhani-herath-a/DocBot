
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import chatbotIcon from '../assets/chatbot_icon.png';
import { CalendarDays, Stethoscope } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [showChatbot, setShowChatbot] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    "💬 Hello! I can help you find the right doctor in seconds.",
    "💬 I'm here for basic health instructions and healthcare guidance."
  ];

  // Show chatbot after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatbot(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Change messages every 3 seconds
  useEffect(() => {
    if (showChatbot) {
      const msgTimer = setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 3000);
      return () => clearTimeout(msgTimer);
    }
  }, [messageIndex, showChatbot, messages.length]);

  const handleBookAppointment = () => {
    const user = JSON.parse(localStorage.getItem('docbotUser'));
    if (user && user.role === 'patient') {
      navigate('/book');
    } else {
      alert('Please log in as a patient to book an appointment.');
      navigate('/login');
    }
  };

  const handleChatbotClick = () => {
    navigate('/chatbot'); // redirect to chatbot page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-400 px-6 py-20 relative">
      <div className="max-w-4xl text-center">
        <div className="flex justify-center mb-1">
          <a href="/" className="flex items-center mb-1 space-x-1">
            <button className="bg-blue-500 text-white rounded-full w-14 h-14 text-2xl shadow-lg p-0">
              <img
                src={chatbotIcon}
                alt="Chatbot Icon"
                style={{ width: 60, height: 60, borderRadius: '50%' }}
              />
            </button>
          </a>
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

      {/* Mini Chatbot Preview */}
      {showChatbot && (
        <div
          className="fixed bottom-6 right-6 flex items-center gap-2 animate-fadeIn"
          style={{ animation: 'fadeIn 0.5s ease-in-out' }}
        >
          <div
            key={messageIndex} // trigger fade when message changes
            className="bg-blue-200 shadow-lg p-3 rounded-lg text-gray-800 text-sm max-w-xs border border-gray-200 transition-opacity duration-500"
          >
            {messages[messageIndex]}
          </div>
          <button
            onClick={handleChatbotClick}
            className="bg-blue-500 rounded-full w-14 h-14 shadow-lg hover:scale-105 transition-transform"
          >
            <img
              src={chatbotIcon}
              alt="Chatbot Icon"
              style={{ width: '100%', height: '100%', borderRadius: '50%' }}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
