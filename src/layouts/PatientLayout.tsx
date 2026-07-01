import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Search, Calendar, Video, FileText, User } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useDemo } from '../context/DemoContext';

export const PatientLayout: React.FC = () => {
  const { activePatient } = useDemo();
  
  const menuItems = [
    { name: 'Dashboard', path: '/patient', icon: LayoutDashboard },
    { name: 'Find Doctor', path: '/patient/find-doctor', icon: Search },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Video Consult', path: '/patient/telehealth', icon: Video },
    { name: 'Medical Records', path: '/patient/records', icon: FileText },
    { name: 'My Profile', path: '/patient/profile', icon: User },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userName={activePatient.name}
      userRoleTitle="Patient Account"
      userAvatar="avatar"
    >
      <Outlet />
    </DashboardLayout>
  );
};
