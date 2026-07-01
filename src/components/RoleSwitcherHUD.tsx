import React, { useState } from 'react';
import { useDemo, UserRole } from '../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, User, Stethoscope, Building2, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RoleSwitcherHUD: React.FC = () => {
  const { role, setRole } = useDemo();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const rolesConfig: { id: UserRole; name: string; icon: any; color: string; desc: string; route: string }[] = [
    { 
      id: 'patient', 
      name: 'Patient Portal', 
      icon: User, 
      color: 'from-blue-500 to-sky-400', 
      desc: 'Alexander Fleming (Active)', 
      route: '/patient' 
    },
    { 
      id: 'doctor', 
      name: 'Doctor Portal', 
      icon: Stethoscope, 
      color: 'from-emerald-500 to-teal-400', 
      desc: 'Dr. Haridas (Cardiologist)', 
      route: '/doctor' 
    },
    { 
      id: 'hospital', 
      name: 'Hospital Dashboard', 
      icon: Building2, 
      color: 'from-purple-500 to-indigo-400', 
      desc: 'Apollo Premium Clinic', 
      route: '/hospital' 
    },
    { 
      id: 'admin', 
      name: 'Super Admin', 
      icon: ShieldAlert, 
      color: 'from-rose-500 to-orange-400', 
      desc: 'Global Platform Admin', 
      route: '/admin' 
    }
  ];

  const handleRoleChange = (roleId: UserRole, route: string) => {
    setRole(roleId);
    navigate(route);
    setIsOpen(false);
  };

  const currentRoleConfig = rolesConfig.find(r => r.id === role) || rolesConfig[0];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="mb-3 w-80 glass-panel-dark text-white rounded-2xl p-4 shadow-2xl border border-slate-700/50 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Demo Control Center
              </span>
              <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30 font-medium">
                Prototype Mode
              </span>
            </div>

            <div className="space-y-2">
              {rolesConfig.map((r) => {
                const IconComponent = r.icon;
                const isActive = r.id === role;
                
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id, r.route)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left group ${
                      isActive 
                        ? 'bg-slate-800 border border-slate-700 shadow-inner' 
                        : 'hover:bg-slate-800/40 border border-transparent hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${r.color} text-white shadow-md shadow-black/10`}>
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {r.name}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {r.desc}
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 pt-2 text-[10px] text-slate-500 text-center border-t border-slate-700/50 leading-tight">
              Switch roles at any step to see cross-system actions propagate in real-time.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg cursor-pointer hover:shadow-xl border border-slate-800 hover:border-slate-700 transition-all font-medium text-sm pulse-glow-blue"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        
        <span className="max-w-[120px] truncate text-slate-300">
          Role: <strong className="text-white capitalize">{currentRoleConfig.id}</strong>
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </motion.button>
    </div>
  );
};
