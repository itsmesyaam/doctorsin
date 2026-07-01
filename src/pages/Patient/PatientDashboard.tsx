import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { motion } from 'framer-motion';
import { 
  Heart, Activity, Moon, Footprints, Video, 
  Calendar, FileText, ChevronRight, AlertCircle 
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activePatient, appointments, prescriptions } = useDemo();

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming' && a.patientId === activePatient.id);
  const latestPrescription = prescriptions.find(p => p.patientId === activePatient.id);
  
  const nextAppt = upcomingAppts.length > 0 
    ? [...upcomingAppts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] 
    : null;

  const healthMetrics = [
    { name: 'Heart Rate', value: '72 bpm', status: 'Normal', icon: Heart, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20', pct: 72 },
    { name: 'Blood Pressure', value: '120/80', status: 'Optimal', icon: Activity, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', pct: 85 },
    { name: 'Sleep Target', value: '7.5 hrs', status: 'Good', icon: Moon, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20', pct: 75 },
    { name: 'Daily Steps', value: '8,420', status: 'Goal: 10k', icon: Footprints, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20', pct: 84 }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-805 dark:text-white tracking-tight">
            Hello, {activePatient.name}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Your medical metrics are stable. You have <strong className="text-blue-600 dark:text-blue-400 font-bold">{upcomingAppts.length} upcoming appointments</strong> scheduled.
          </p>
        </div>
        <button
          onClick={() => navigate('/patient/find-doctor')}
          className="bg-blue-600 text-white font-semibold text-sm px-5 py-3 rounded-2xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 cursor-pointer"
        >
          Book Consultation
        </button>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Call HUDBanner */}
          {nextAppt ? (
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-gradient-to-tr from-blue-750 to-blue-600 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-2xl" />
              
              <div className="space-y-3 max-w-md">
                <span className="bg-white/20 border border-white/20 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block">
                  Next Telehealth Call
                </span>
                <h3 className="text-xl font-bold">{nextAppt.doctorName}</h3>
                <p className="text-xs text-blue-100 font-medium">
                  {nextAppt.doctorSpecialty} • {nextAppt.date} at {nextAppt.timeSlot} ({nextAppt.type === 'video' ? 'Video Call' : 'In-Clinic'})
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-100 bg-blue-700/40 p-2 rounded-xl border border-blue-600/30">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Please log in 5 minutes early to test your camera connection.</span>
                </div>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem('demo_active_telehealth_appt_id', nextAppt.id);
                  navigate('/patient/telehealth');
                }}
                className="bg-white text-blue-650 hover:bg-blue-50 font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shrink-0 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Video size={16} />
                <span>Join Call</span>
              </button>
            </motion.div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl text-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
              No upcoming consultations scheduled. Click Book Consultation to connect with a specialist.
            </div>
          )}

          {/* Vitals circular widgets */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-850 dark:text-white">Your Vitals Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {healthMetrics.map((met) => {
                const Icon = met.icon;
                const strokeDash = (2 * Math.PI * 24); // 2 * pi * r (r=24)
                const offset = strokeDash - (met.pct / 100) * strokeDash;

                return (
                  <div key={met.name} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between items-center text-center">
                    
                    {/* SVG Circular progress */}
                    <div className="relative h-16 w-16 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="24" className="stroke-slate-100 dark:stroke-slate-800 fill-none stroke-2" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="24" 
                          className="stroke-blue-600 fill-none stroke-2" 
                          strokeDasharray={strokeDash}
                          strokeDashoffset={offset}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className={`p-2 rounded-full ${met.color}`}>
                        <Icon size={16} />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">{met.name}</span>
                      <span className="text-lg font-black text-slate-800 dark:text-white block mt-0.5">{met.value}</span>
                      <span className="text-[9px] text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full inline-block mt-1">
                        {met.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side shortcuts & files */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-5">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Quick Shortcuts</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/patient/find-doctor')}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 rounded-2xl transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Find Specialists</h4>
                    <p className="text-[10px] text-slate-400">Consult cardiologists, dermatologists...</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>

              <button 
                onClick={() => navigate('/patient/records')}
                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 rounded-2xl transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-600 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">View Prescriptions</h4>
                    <p className="text-[10px] text-slate-400">Dosage details & histories</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Active prescription */}
          {latestPrescription && (
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 text-left space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Active Prescription</h3>
              
              <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/40 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{latestPrescription.doctorName}</h4>
                    <span className="text-[10px] text-slate-400">{latestPrescription.date}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="space-y-2 border-t border-slate-200/50 dark:border-slate-850 pt-3">
                  {latestPrescription.medicines.slice(0, 2).map((med, index) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-slate-850 dark:text-slate-200">{med.name}</span>
                        <span className="text-[10px] text-slate-400 block">{med.instructions}</span>
                      </div>
                      <span className="bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded font-medium text-slate-600 dark:text-slate-300 text-[10px]">
                        {med.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate('/patient/records')}
                className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 py-2 block"
              >
                View Full Medical Files
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
