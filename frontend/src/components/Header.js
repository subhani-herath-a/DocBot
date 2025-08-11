
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import chatbotIcon from '../assets/chatbot_icon.png';

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="p-1 bg-gray-900 text-white flex justify-between items-center">
      <div className="flex items-center mb-4">
        <a href="/" className="flex items-center mb-1 space-x-1">
          <button className="bg-blue-500 text-white rounded-full w-14 h-14 text-2xl shadow-lg p-0">
            <img 
              src={chatbotIcon}
              alt="Chatbot Icon"
              style={{ width: 60, height: 60, borderRadius: '50%' }}
            />
          </button>
          <span className="text-2xl font-bold">DocBot</span>
        </a>
      </div>

      <nav className="flex items-center">
        <Link to="/" className="hover:text-blue-600 mx-3 text-xl">Home</Link>
        <Link to="/about" className="hover:text-blue-600 mx-3 text-xl">About</Link>
        <Link to="/features" className="hover:text-blue-600 mx-3 text-xl">Features</Link>
        <Link to="/contact" className="hover:text-blue-600 mx-3 text-xl">Contact</Link>

         {!isLoggedIn ? (
          <Link
            to="/login"
            className="mx-3 text-xl text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white"
          >
            Login
          </Link>
        ) : (
          <>
            {user && user.firstName && (
              <span className="mx-3 text-xl text-gray-400">Hi, {user.firstName}</span>
            )}
            <button onClick={handleLogout} className="mx-3 text-xl text-red-300 border border-red-400 px-3 py-1 rounded hover:bg-red-500 hover:text-white">
              Logout
            </button>
          </>
        )}

      </nav>
    </header>
  );
}

export default Header;
