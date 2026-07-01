import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';
import { useDemo } from '../context/DemoContext';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface DashboardLayoutProps {
  menuItems: MenuItem[];
  userName: string;
  userRoleTitle: string;
  userAvatar: string;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  menuItems,
  userName,
  userRoleTitle,
  userAvatar,
  children
}) => {
  const { role, changeRole, notifications, theme, toggleTheme } = useDemo();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeNotifications = notifications.filter(n => n.role === role && !n.read);

  const handleLogout = () => {
    changeRole('patient');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 dark:bg-slate-950 text-slate-300 border-r border-slate-805 dark:border-slate-900 shrink-0">
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-805 dark:border-slate-900">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-extrabold text-xl tracking-wider">D+</span>
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">DOCTORS</span>
              <span className="font-extrabold text-blue-500 text-lg tracking-tight">IN</span>
            </div>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="p-6 border-b border-slate-805 dark:border-slate-900">
          <div className="flex items-center gap-4">
            <img 
              src={userAvatar} 
              alt={userName} 
              className="h-12 w-12 rounded-xl object-cover border border-slate-700 shadow-md"
            />
            <div className="truncate text-left">
              <h4 className="text-sm font-semibold text-white truncate">{userName}</h4>
              <span className="text-[11px] font-medium text-slate-400 capitalize tracking-wider">{userRoleTitle}</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: linkActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                    linkActive || isActive
                      ? 'text-white bg-blue-650 shadow-md shadow-blue-600/10'
                      : 'text-slate-400 hover:text-slate-205 hover:bg-slate-800/40'
                  }`
                }
              >
                <div className="flex items-center gap-3.5 z-10">
                  <Icon size={18} className="shrink-0" />
                  <span>{item.name}</span>
                </div>
                {(isActive) && (
                  <ChevronRight size={14} className="opacity-70 z-10" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-805 dark:border-slate-900 space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-455 hover:bg-rose-950/20 transition-all duration-200 text-left cursor-pointer"
          >
            <LogOut size={18} />
            <span>Return to Landing</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header Dashboard Nav */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-8 z-30 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:block text-left">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white capitalize leading-tight">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Welcome back to DOCTORSIN medical suite.</p>
            </div>
          </div>

          {/* Right Header Panel */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-slate-655 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Notification Trigger */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 text-slate-605 dark:text-slate-300 hover:text-blue-650 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all relative cursor-pointer"
              >
                <Bell size={20} />
                {activeNotifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 border border-white dark:border-slate-900 pulse-glow-blue"></span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 z-50 text-left"
                    >
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-800 dark:text-white text-sm">Notifications</span>
                        {activeNotifications.length > 0 && (
                          <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455 text-xs px-2 py-0.5 rounded-full font-bold">
                            {activeNotifications.length} New
                          </span>
                        )}
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {activeNotifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            No unread notifications
                          </div>
                        ) : (
                          activeNotifications.map(n => (
                            <div key={n.id} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-left transition-colors">
                              <p className="text-xs font-bold text-slate-800 dark:text-white">{n.title}</p>
                              <p className="text-[11px] text-slate-550 dark:text-slate-400 mt-0.5 leading-tight">{n.message}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Info */}
            <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
              <img 
                src={userAvatar} 
                alt={userName} 
                className="h-10 w-10 rounded-xl object-cover shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-slate-808 dark:text-white leading-tight">{userName}</p>
                <p className="text-[10px] font-bold text-blue-650 dark:text-blue-400 tracking-wider capitalize">{role} Account</p>
              </div>
            </div>
          </div>
        </header>

        {/* Core View Dashboard Outlet Container */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-305 z-50 flex flex-col lg:hidden border-r border-slate-800"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <span className="font-extrabold text-sm">D+</span>
                  </div>
                  <span className="font-bold text-white text-base">DOCTORSIN</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 border-b border-slate-800 flex items-center gap-4">
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="h-10 w-10 rounded-xl object-cover border border-slate-700"
                />
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-white">{userName}</h4>
                  <span className="text-[10px] text-slate-400 capitalize">{userRoleTitle}</span>
                </div>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive: linkActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          linkActive || isActive
                            ? 'text-white bg-blue-600'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </div>
                      {(isActive) && (
                        <ChevronRight size={14} className="opacity-70" />
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-455 hover:bg-rose-955/20 transition-all text-left"
                >
                  <LogOut size={18} />
                  <span>Return to Landing</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
