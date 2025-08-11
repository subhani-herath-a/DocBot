import React, { useState } from "react";
import { Button } from "../components/ui/button";
import chatbotIcon from '../assets/chatbot_icon.png';
import {
  Calendar, Clock, Settings, Bell ,User,
  Menu, X, Home
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DashboardLayout = ({ children, userType }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const getMenuItems = () => {
    switch (userType) {
      case "patient":
        return [
          { icon: Home, label: "Dashboard", href: "/patient" },
          { icon: Calendar, label: "Book Appointment", href: "/book" },
          { icon: Clock, label: "My Appointments", href: "/appointments" },
          { icon: User, label: "Medical Records", href: "/records" },
          { icon: Bell, label: "Notifications", href: "/notifications" },
          { icon: Settings, label: "Profile Settings", href: "/settings" },
        ];
      case "doctor":
        return [
          { icon: Home, label: "Dashboard", href: "/doctor" },
          { icon: Calendar, label: "Manage Availability", href: "/availability" },
          { icon: Clock, label: "Appointments", href: "/doctor/appointments" },
          { icon: User, label: "Patient Records", href: "/patients" },
          { icon: Bell, label: "Notifications", href: "/doctor-notifications" },
          { icon: Settings, label: "Profile Settings", href: "/doctor-settings" },
        ];
      case "admin":
        return [
          { icon: Home, label: "Dashboard", href: "/admin" },
          { icon: User, label: "Manage Users", href: "/admin/users" },
          { icon: Calendar, label: "Appointments Overview", href: "/admin/appointments" },
          { icon: Settings, label: "System Settings", href: "/admin/settings" },
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => navigate("/");

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex flex-col items-center w-full">
            {/* Profile Info */}
            {userType === "patient"||"doctor" && (
              <div className="mt-4 bg-blue-50 rounded-lg px-4 py-3 text-center shadow">
                <div className="text-sm font-semibold text-gray-800">
                  {JSON.parse(localStorage.getItem("user"))?.name || "Name"}
                </div>
                <div className="text-xs text-gray-500 break-all">
                  {JSON.parse(localStorage.getItem("user"))?.email || "email@example.com"}
                </div>
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <header className="bg-white shadow-sm border-b h-16">
          <div className="flex items-center justify-between h-full px-6">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            {/* <div className="hidden lg:block">
              <h2 className="text-lg font-semibold capitalize">{userType} Dashboard</h2>
            </div> */}
            
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
