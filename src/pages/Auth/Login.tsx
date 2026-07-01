import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo, UserRole } from '../../context/DemoContext';
import { motion } from 'framer-motion';
import { ShieldAlert, User, Stethoscope, Building2, Key, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { DoctorsInLogo } from '../../components/DoctorsInLogo';

export const Login: React.FC = () => {
  const { changeRole } = useDemo();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('patient@doctorsin.com');
  const [password, setPassword] = useState('••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const rolesConfig: { id: UserRole; name: string; icon: any; color: string; desc: string; route: string; defaultEmail: string }[] = [
    { id: 'patient', name: 'Patient', icon: User, color: 'text-blue-500 bg-blue-50 border-blue-200', desc: 'Hari Krishnan', route: '/patient', defaultEmail: 'patient@doctorsin.com' },
    { id: 'doctor', name: 'Doctor', icon: Stethoscope, color: 'text-emerald-500 bg-emerald-50 border-emerald-200', desc: 'Dr. Haridas Menon', route: '/doctor', defaultEmail: 'doctor@doctorsin.com' },
    { id: 'hospital', name: 'Hospital', icon: Building2, color: 'text-purple-500 bg-purple-50 border-purple-200', desc: 'Aster Medcity', route: '/hospital', defaultEmail: 'hospital@doctorsin.com' },
    { id: 'admin', name: 'Admin', icon: ShieldAlert, color: 'text-rose-500 bg-rose-50 border-rose-200', desc: 'System Admin', route: '/admin', defaultEmail: 'admin@doctorsin.com' }
  ];

  const handleRoleChange = (roleId: UserRole) => {
    setSelectedRole(roleId);
    const conf = rolesConfig.find(r => r.id === roleId);
    if (conf) {
      setEmail(conf.defaultEmail);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      changeRole(selectedRole);
      const conf = rolesConfig.find(r => r.id === selectedRole);
      if (conf) {
        navigate(conf.route);
      }
      setIsSubmitting(false);
    }, 1200);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setTimeout(() => setOtpSent(false), 3000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 text-left">
      {/* Left panel: Branding and illustrations */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow rings */}
        <div className="absolute top-0 right-0 h-64 w-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="flex items-center">
          <DoctorsInLogo variant="horizontal" size="sm" theme="dark" />
        </div>

        <div className="space-y-6 animate-float">
          <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl w-fit">
            <Sparkles size={24} className="text-blue-400" />
          </div>
          <h2 className="text-3xl font-black leading-tight tracking-tight">
            Integrated Medical <br />
            Dashboard Systems.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Access secure telemedicine signaling pipelines, real-time ICU ward monitors, and global revenue analytics metrics.
          </p>
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          © {new Date().getFullYear()} DOCTORSIN Platform. All Rights Reserved.
        </span>
      </div>

      {/* Right panel: Login Card */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-xl"
        >
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Secure Sign In</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Select your operational account role to proceed.</p>
          </div>

          {/* Role selector grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {rolesConfig.map((r) => {
              const Icon = r.icon;
              const isSelected = r.id === selectedRole;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{r.name}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Operational Email</label>
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs">
                <Mail size={14} className="text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none w-full font-medium dark:text-white" 
                />
              </div>
            </div>

            {!useOtp ? (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-455 uppercase">Access Token / Password</label>
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs">
                  <Key size={14} className="text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-none outline-none w-full font-medium dark:text-white" 
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-455 uppercase">One-Time Password (OTP)</label>
                  <button 
                    type="button" 
                    onClick={handleSendOtp}
                    className="text-[10px] text-blue-600 hover:text-blue-700 font-bold"
                  >
                    {otpSent ? 'OTP Sent!' : 'Send OTP'}
                  </button>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs">
                  <Key size={14} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP code"
                    className="bg-transparent border-none outline-none w-full font-medium dark:text-white" 
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button 
                type="button"
                onClick={() => setUseOtp(!useOtp)}
                className="text-xs text-blue-605 font-bold hover:underline"
              >
                {useOtp ? 'Use standard password' : 'Sign in via mobile OTP'}
              </button>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Loading dashboard...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase block text-center tracking-wider">
              Or Federated Corporate Access
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => { changeRole('patient'); navigate('/patient'); }}
                className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
              >
                <span>Google SSO</span>
              </button>
              <button 
                onClick={() => { changeRole('patient'); navigate('/patient'); }}
                className="flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
              >
                <span>Microsoft Azure</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
