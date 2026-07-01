import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Activity, Moon, Footprints, Video, Phone,
  Calendar, FileText, ChevronRight, AlertCircle, Sparkles, Check, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MedicalAvatar } from '../../components/MedicalAvatar';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, appointments, prescriptions } = useDemo();

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming' && a.patientId === activePatient.id);
  const latestPrescription = prescriptions.find(p => p.patientId === activePatient.id);
  
  const nextAppt = upcomingAppts.length > 0 
    ? [...upcomingAppts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] 
    : null;

  // Medicine reminder checkboxes state
  const [takenMeds, setTakenMeds] = useState<Record<string, boolean>>({});

  const toggleMed = (medId: string) => {
    const nextVal = !takenMeds[medId];
    setTakenMeds(prev => ({ ...prev, [medId]: nextVal }));
    
    if (nextVal) {
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    }
  };

  const healthMetrics = [
    { name: 'Heart Rate', value: '72 bpm', status: 'Normal', icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20', pct: 72 },
    { name: 'Blood Pressure', value: '120/80', status: 'Optimal', icon: Activity, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', pct: 85 },
    { name: 'Sleep Target', value: '7.5 hrs', status: 'Good', icon: Moon, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20', pct: 75 },
    { name: 'Daily Steps', value: '8,420', status: 'Goal: 10k', icon: Footprints, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20', pct: 84 }
  ];

  const medicineReminders = [
    { id: 'med-1', name: 'Albuterol Inhaler', dosage: '2 Puffs', time: '09:00 AM', instruction: 'Pre-workout / Morning' },
    { id: 'med-2', name: 'Montelukast Sodium', dosage: '10 mg', time: '09:00 PM', instruction: 'Before sleep' }
  ];

  return (
    <div className="space-y-6 text-left pb-20 select-none">
      
      {/* Greeting Card Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
        <div className="text-left">
          <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Health Dashboard</span>
          <h2 className="text-xl font-black text-slate-808 dark:text-white mt-0.5">Hello, {activePatient.name}</h2>
          <span className="text-xs text-slate-500 mt-1 block">Your vitals are stable.</span>
        </div>
        <MedicalAvatar name={activePatient.name} type="patient" size={10} />
      </div>

      {/* Floating emergency SOS trigger */}
      <div className="fixed bottom-24 right-4 z-40">
        <button
          onClick={() => alert("SOS Triggered: Ambulance AMB-402 has been prioritized and dispatched! Check the Hospital Emergency Radar.")}
          className="h-12 w-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border border-rose-500/20 hover:bg-rose-700 animate-pulse cursor-pointer"
        >
          <Phone size={20} />
        </button>
      </div>

      {/* Active Consult Banner */}
      {nextAppt ? (
        <div className="bg-gradient-to-tr from-blue-700 to-blue-600 text-white p-5 rounded-3xl shadow-md space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
          
          <div className="space-y-1 z-10 text-left">
            <span className="bg-white/20 border border-white/20 text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block">
              Next Video Call
            </span>
            <h3 className="text-lg font-bold">{nextAppt.doctorName}</h3>
            <p className="text-[10px] text-blue-105">
              {nextAppt.doctorSpecialty} • {nextAppt.date} at {nextAppt.timeSlot}
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.setItem('demo_active_telehealth_appt_id', nextAppt.id);
              navigate('/patient/telehealth');
            }}
            className="w-full bg-white text-blue-650 font-bold text-xs py-3 rounded-2xl shadow flex items-center justify-center gap-1.5 cursor-pointer z-10 relative"
          >
            <Video size={14} />
            <span>Join Call Room</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-105 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 p-5 rounded-3xl text-center text-slate-500 text-xs font-semibold">
          No appointments scheduled.
        </div>
      )}

      {/* Quick Action Circles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { name: 'Find Doctor', path: '/patient/find-doctor', icon: Calendar, color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600' },
          { name: 'Medical Files', path: '/patient/records', icon: FileText, color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-650' },
          { name: 'Active Call', path: '/patient/telehealth', icon: Video, color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-650' }
        ].map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(act.path)}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <div className={`p-2.5 rounded-2xl ${act.color}`}>
                <Icon size={16} />
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{act.name}</span>
            </button>
          );
        })}
      </div>

      {/* Medicine Reminders (Super App Feature) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-805 rounded-3xl p-5 space-y-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Medicine Reminders</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Today</span>
        </div>

        <div className="space-y-3">
          {medicineReminders.map((med) => {
            const isTaken = !!takenMeds[med.id];
            return (
              <div 
                key={med.id} 
                onClick={() => toggleMed(med.id)}
                className={`p-3.5 rounded-2xl border transition-all flex justify-between items-center cursor-pointer text-left ${
                  isTaken 
                    ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-200/50 dark:border-slate-850 opacity-60' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-305'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-xs ${isTaken ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                      {med.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">• {med.dosage}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{med.instruction}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock size={11} />
                    {med.time}
                  </span>
                  
                  {/* Check circle */}
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                    isTaken 
                      ? 'bg-emerald-600 border-emerald-500 text-white' 
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950'
                  }`}>
                    {isTaken ? <Check size={12} /> : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vitals summary cards (Stacked cards, no desktop grids) */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-850 dark:text-white text-sm">Your Health Vitals</h3>
        <div className="space-y-3">
          {healthMetrics.map((met) => {
            const Icon = met.icon;
            const strokeDash = (2 * Math.PI * 18); // 2 * pi * r (r=18)
            const offset = strokeDash - (met.pct / 100) * strokeDash;

            return (
              <div 
                key={met.name} 
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className={`p-2.5 rounded-2xl ${met.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">{met.name}</span>
                    <span className="text-base font-black text-slate-800 dark:text-white block mt-0.5">{met.value}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full font-bold uppercase">
                    {met.status}
                  </span>
                  
                  {/* SVG mini progress ring */}
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle cx="16" cy="16" r="12" className="stroke-slate-100 dark:stroke-slate-800 fill-none stroke-2" />
                    <circle 
                      cx="16" 
                      cy="16" 
                      r="12" 
                      className="stroke-blue-600 fill-none stroke-2" 
                      strokeDasharray={strokeDash}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Prescription Vault list */}
      {latestPrescription && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-850 dark:text-white text-sm">Active Prescription Vault</h3>
            <button 
              onClick={() => navigate('/patient/records')}
              className="text-[10px] font-bold text-blue-650 dark:text-blue-400"
            >
              All Records
            </button>
          </div>

          <div className="border border-slate-100 dark:border-slate-850 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/40 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-white">{latestPrescription.doctorName}</h4>
                <span className="text-[10px] text-slate-400">{latestPrescription.date}</span>
              </div>
              <span className="text-[9px] font-bold text-blue-650 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            
            <div className="space-y-2 border-t border-slate-200/50 dark:border-slate-800 pt-3">
              {latestPrescription.medicines.slice(0, 2).map((med, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-808 dark:text-slate-200">{med.name}</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{med.instructions}</span>
                  </div>
                  <span className="bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-600 dark:text-slate-300 text-[9px] whitespace-nowrap">
                    {med.dosage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
