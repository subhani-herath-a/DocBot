import React from 'react';
import {  Mail, Phone, MapPin } from 'lucide-react';
import chatbotIcon from '../assets/chatbot_icon.png';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo + Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              
                     
            <button
        className=" bg-blue-500 text-white rounded-full w-14 h-14 text-2xl shadow-lg">
         <img
          src={chatbotIcon}
          alt="Chatbot Icon"
          style={{ width: 60, height: 60, borderRadius: '50%' }}
        />
      </button>
                        
              <span className="text-2xl font-bold">DocBot</span>
            </div>

            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing healthcare with innovative digital solutions that connect 
              patients and providers for better health outcomes.
            </p>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@docbot.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Healthcare Ave, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {/* { <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link></li>
            </ul>
          </div> } */}

          {/* Services */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Appointment Booking</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Medical Records</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">AI Health Assistant</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Doctor Dashboard</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-pointer">Admin Panel</span></li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} DocBot. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="/term" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div> {/* closes max-w-7xl */}
    </footer>
  );
};

export default Footer;
