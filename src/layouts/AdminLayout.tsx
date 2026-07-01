import React from 'react';
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, ShieldCheck, Settings } from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export const AdminLayout: React.FC = () => {
  const menuItems = [
    { name: 'Global Statistics', path: '/admin', icon: LayoutDashboard },
    { name: 'Verification Queue', path: '/admin/approvals', icon: ShieldCheck },
    { name: 'User Directory', path: '/admin/users', icon: CheckSquare },
    { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      userName="Admin Console"
      userRoleTitle="Super Administrator"
      userAvatar="avatar"
    >
      <Outlet />
    </DashboardLayout>
  );
};
