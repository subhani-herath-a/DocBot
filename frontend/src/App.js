
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Layouts
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingChatBot from './components/FloatingChatBot';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';

// Functional Pages
import BookAppointment from './pages/BookAppointment';
import PatientRecords from './pages/patient/PatientRecords';
import DoctorPatientViewer from './pages/doctor/DoctorPatientViewer';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientNotifications from './pages/patient/PatientNotifications';
import PatientProfileSettings from './pages/patient/PatientProfileSettings';
import DoctorNotifications from './pages/doctor/DoctorNotifications';
import DoctorProfileSettings from './pages/doctor/DoctorProfileSettings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Dashboard */}
        <Route path="/patient" element={ <PatientDashboard />} />
        <Route path="/book" element={<DashboardLayout userType="patient"><BookAppointment /></DashboardLayout>} />
        <Route path="/appointments" element={<PatientAppointments />} />
        <Route path="/records" element={<PatientRecords />}/>
        <Route path="/notifications" element={<PatientNotifications />} />
        <Route path="/settings" element={<PatientProfileSettings />} />

        {/* Doctor Dashboard */}
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/availability" element={<DashboardLayout userType="doctor"><DoctorAvailability /></DashboardLayout>} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/patients" element={<DoctorPatientViewer />} />
        <Route path="/doctor-notifications" element={<DashboardLayout userType="doctor"><DoctorNotifications /></DashboardLayout>} />
        <Route path="/doctor-settings" element={<DoctorProfileSettings />} />
        
        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      <FloatingChatBot />
      <Footer />
    </Router>
  );
}

export default App;
