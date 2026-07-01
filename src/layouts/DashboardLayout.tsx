import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, LogOut, ChevronRight, Sun, Moon, MoreHorizontal } from 'lucide-react';
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
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeNotifications = notifications.filter(n => n.role === role && !n.read);

  const handleLogout = () => {
    setIsMoreSheetOpen(false);
    changeRole('patient');
    navigate('/');
  };

  // Split menu items for bottom nav (first 4 items, rest go to "More" sheet)
  const bottomNavItems = menuItems.slice(0, 4);
  const overflowNavItems = menuItems.slice(4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row transition-colors duration-300">
      
      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 dark:bg-slate-950 text-slate-300 border-r border-slate-805 dark:border-slate-900 shrink-0">
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-855 dark:border-slate-900">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-extrabold text-xl tracking-wider">D+</span>
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">DOCTORS</span>
              <span className="font-extrabold text-blue-505 text-lg tracking-tight">IN</span>
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-455 hover:bg-rose-955/20 transition-all duration-200 text-left cursor-pointer"
          >
            <LogOut size={18} />
            <span>Return to Landing</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden pb-16 lg:pb-0">
        
        {/* Header - Sticky */}
        <header className="h-16 lg:h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 lg:px-8 z-30 shrink-0 sticky top-0 transition-colors duration-300">
          <div className="flex items-center gap-3">
            {/* Logo on mobile header */}
            <Link to="/" className="flex lg:hidden items-center gap-1.5">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow shadow-blue-500/15">
                D+
              </div>
              <span className="font-extrabold text-slate-800 dark:text-white text-sm tracking-tight">DOCTORSIN</span>
            </Link>

            <div className="hidden lg:block text-left">
              <h1 className="text-xl font-bold text-slate-808 dark:text-white capitalize leading-tight">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Welcome back to DOCTORSIN medical suite.</p>
            </div>
          </div>

          {/* Right Header Panel */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-655 dark:text-slate-300 hover:text-blue-650 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notification Trigger */}
            <div className="relative font-sans">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-605 dark:text-slate-300 hover:text-blue-650 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-all relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {activeNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 border border-white dark:border-slate-900 pulse-glow-blue"></span>
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
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-50 text-left"
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-slate-800 dark:text-white text-xs">Notifications</span>
                        {activeNotifications.length > 0 && (
                          <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {activeNotifications.length} New
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {activeNotifications.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            No unread notifications
                          </div>
                        ) : (
                          activeNotifications.map(n => (
                            <div key={n.id} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-left transition-colors">
                              <p className="text-xs font-bold text-slate-800 dark:text-white">{n.title}</p>
                              <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-0.5 leading-tight">{n.message}</p>
                              <span className="text-[8px] text-slate-400 mt-1 block">{n.time}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Info - Desktop Only */}
            <div className="hidden sm:flex items-center gap-2.5 border-l border-slate-205 dark:border-slate-800 pl-3">
              <img 
                src={userAvatar} 
                alt={userName} 
                className="h-8 w-8 rounded-lg object-cover shadow-sm ring-1 ring-slate-100 dark:ring-slate-800"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-808 dark:text-white leading-tight">{userName}</p>
                <p className="text-[9px] font-bold text-blue-600 dark:text-blue-400 tracking-wider capitalize">{role} Account</p>
              </div>
            </div>
          </div>
        </header>

        {/* Core View Outlet Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 flex lg:hidden items-center justify-around z-40 px-2 pb-safe select-none shadow-lg">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors relative ${
                isActive ? 'text-blue-600 dark:text-blue-400 font-extrabold' : ''
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400 scale-105 transition-transform' : ''} />
              <span className="text-[9px] font-bold tracking-tight mt-1">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-dot"
                  className="absolute bottom-1.5 h-1 w-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                />
              )}
            </NavLink>
          );
        })}
        
        {/* More Tab */}
        <button
          onClick={() => setIsMoreSheetOpen(true)}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 dark:text-slate-500 cursor-pointer ${
            isMoreSheetOpen ? 'text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <MoreHorizontal size={20} />
          <span className="text-[9px] font-bold tracking-tight mt-1">More</span>
        </button>
      </nav>

      {/* Mobile "More" Slide-up Bottom Sheet Drawer */}
      <AnimatePresence>
        {isMoreSheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center">
            
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreSheetOpen(false)}
              className="absolute inset-0 bg-slate-900"
            />

            {/* Bottom Sheet Modal content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-[2rem] shadow-2xl p-6 z-10 max-h-[85vh] flex flex-col"
            >
              {/* Grab handle strip */}
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6 shrink-0 cursor-pointer" onClick={() => setIsMoreSheetOpen(false)} />
              
              {/* Profile card summary */}
              <div className="flex items-center gap-4 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800 shrink-0 text-left">
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="h-14 w-14 rounded-2xl object-cover border border-slate-100 dark:border-slate-800 shadow"
                />
                <div>
                  <h4 className="font-extrabold text-slate-808 dark:text-white text-base leading-tight">{userName}</h4>
                  <span className="text-xs text-slate-400 capitalize">{userRoleTitle} Profile</span>
                </div>
              </div>

              {/* Overflow List Links */}
              <div className="flex-1 overflow-y-auto space-y-2">
                {overflowNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMoreSheetOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold text-left transition-colors ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className="text-slate-400 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-350" />
                    </NavLink>
                  );
                })}

                {/* Return/Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold text-left text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors mt-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={18} className="shrink-0" />
                    <span>Return to Landing</span>
                  </div>
                  <ChevronRight size={14} className="text-rose-400" />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="mt-6 w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl text-xs cursor-pointer"
              >
                Close Menu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
