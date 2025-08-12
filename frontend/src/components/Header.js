
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // <-- import useLocation
import chatbotIcon from '../assets/chatbot_icon.png';

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // get current path
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper to check if link is active
  const isActive = (path) => {
    // For root, exact match; otherwise, startsWith to cover subpaths if needed
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Common classes for links
  const baseLinkClasses = "mx-3 text-xl";
  const activeLinkClasses = "text-blue-600 font-semibold border-b-2 border-blue-600";
  const inactiveLinkClasses = "hover:text-blue-600";

  // For mobile links
  const mobileBaseClasses = "block px-3 py-1 rounded";
  const mobileActiveClasses = "text-blue-600 font-semibold bg-blue-100";
  const mobileInactiveClasses = "hover:text-blue-600";

  return (
    <header className="p-2 bg-gray-900 text-white">
      <div className="flex justify-between items-center">
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center">
          <Link
            to="/"
            className={`${baseLinkClasses} ${isActive('/') ? activeLinkClasses : inactiveLinkClasses}`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`${baseLinkClasses} ${isActive('/about') ? activeLinkClasses : inactiveLinkClasses}`}
          >
            About
          </Link>
          <Link
            to="/features"
            className={`${baseLinkClasses} ${isActive('/features') ? activeLinkClasses : inactiveLinkClasses}`}
          >
            Features
          </Link>
          <Link
            to="/contact"
            className={`${baseLinkClasses} ${isActive('/contact') ? activeLinkClasses : inactiveLinkClasses}`}
          >
            Contact
          </Link>

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
              <button
                onClick={handleLogout}
                className="mx-3 text-xl text-red-300 border border-red-400 px-3 py-1 rounded hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button - Only on phones */}
        <button
          className="md:hidden flex flex-col space-y-1 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Dropdown - Only on phones */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-gray-800 rounded-lg shadow-lg p-3 space-y-2">
          <Link
            to="/"
            className={`${mobileBaseClasses} ${isActive('/') ? mobileActiveClasses : mobileInactiveClasses}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`${mobileBaseClasses} ${isActive('/about') ? mobileActiveClasses : mobileInactiveClasses}`}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/features"
            className={`${mobileBaseClasses} ${isActive('/features') ? mobileActiveClasses : mobileInactiveClasses}`}
            onClick={() => setMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/contact"
            className={`${mobileBaseClasses} ${isActive('/contact') ? mobileActiveClasses : mobileInactiveClasses}`}
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="block text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <>
              {user && user.firstName && (
                <span className="block text-gray-400">Hi, {user.firstName}</span>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-red-300 border border-red-400 px-3 py-1 rounded hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
