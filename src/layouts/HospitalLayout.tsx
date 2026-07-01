import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, BedDouble, Users, CreditCard, Settings } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';
import { useDemo } from '../context/DemoContext';

export const HospitalLayout: React.FC = () => {
  const { activeHospital } = useDemo();

  const menuItems = [
    { name: 'Overview', path: '/hospital', icon: LayoutDashboard },
    { name: 'Beds Management', path: '/hospital/beds', icon: BedDouble },
    { name: 'Staff & Roster', path: '/hospital/staff', icon: Users },
    { name: 'Revenue Reports', path: '/hospital/revenue', icon: CreditCard },
    { name: 'Clinic Settings', path: '/hospital/settings', icon: Settings },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userName={activeHospital.name}
      userRoleTitle="Hospital Administrator"
      userAvatar="avatar"
    >
      <Outlet />
    </DashboardLayout>
  );
};
