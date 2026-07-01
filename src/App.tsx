import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider } from './context/DemoContext';
import { RoleSwitcherHUD } from './components/RoleSwitcherHUD';
import { StoryModeHUD } from './components/StoryModeHUD';
import { AIAssistant } from './components/AIAssistant';

// Layouts
import { PatientLayout } from './layouts/PatientLayout';
import { DoctorLayout } from './layouts/DoctorLayout';
import { HospitalLayout } from './layouts/HospitalLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public/Auth pages
import { LandingPage } from './pages/Landing/LandingPage';
import { Login } from './pages/Auth/Login';

// Patient pages
import { PatientDashboard } from './pages/Patient/PatientDashboard';
import { FindDoctor } from './pages/Patient/FindDoctor';
import { Appointments } from './pages/Patient/Appointments';
import { Telehealth } from './pages/Patient/Telehealth';
import { Records } from './pages/Patient/Records';
import { PatientProfile } from './pages/Patient/PatientProfile';

// Doctor pages
import { DoctorDashboard } from './pages/Doctor/DoctorDashboard';
import { Consultation } from './pages/Doctor/Consultation';
import { Calendar } from './pages/Doctor/Calendar';
import { Analytics } from './pages/Doctor/Analytics';
import { DoctorProfile } from './pages/Doctor/DoctorProfile';

// Hospital pages
import { HospitalOverview } from './pages/Hospital/Overview';
import { Beds } from './pages/Hospital/Beds';
import { Staff } from './pages/Hospital/Staff';
import { Revenue } from './pages/Hospital/Revenue';
import { Settings as HospitalSettings } from './pages/Hospital/Settings';

// Admin pages
import { GlobalStats } from './pages/Admin/GlobalStats';
import { Approvals } from './pages/Admin/Approvals';
import { UsersDirectory } from './pages/Admin/Users';
import { AdminSettings } from './pages/Admin/Settings';

import './App.css';

function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Patient Portal */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="find-doctor" element={<FindDoctor />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="telehealth" element={<Telehealth />} />
            <Route path="records" element={<Records />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>

          {/* Doctor Portal */}
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="consultation" element={<Consultation />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Route>

          {/* Hospital Portal */}
          <Route path="/hospital" element={<HospitalLayout />}>
            <Route index element={<HospitalOverview />} />
            <Route path="beds" element={<Beds />} />
            <Route path="staff" element={<Staff />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="settings" element={<HospitalSettings />} />
          </Route>

          {/* Super Admin Portal */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<GlobalStats />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="users" element={<UsersDirectory />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Presenter Tools & Floating Switchers */}
        <StoryModeHUD />
        <RoleSwitcherHUD />
        <AIAssistant />
      </BrowserRouter>
    </DemoProvider>
  );
}

export default App;
