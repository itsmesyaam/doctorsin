import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, PlayCircle, Calendar, BarChart3, User } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useDemo } from '../context/DemoContext';

export const DoctorLayout: React.FC = () => {
  const { activeDoctor } = useDemo();

  const menuItems = [
    { name: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
    { name: 'Consultation Room', path: '/doctor/consultation', icon: PlayCircle },
    { name: 'Roster Calendar', path: '/doctor/calendar', icon: Calendar },
    { name: 'Analytics & Earnings', path: '/doctor/analytics', icon: BarChart3 },
    { name: 'Doctor Profile', path: '/doctor/profile', icon: User },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userName={activeDoctor.name}
      userRoleTitle={activeDoctor.specialty}
      userAvatar={activeDoctor.imageUrl}
    >
      <Outlet />
    </DashboardLayout>
  );
};
