import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { 
  Users, Calendar, Clock, Heart, PlayCircle, 
  TrendingUp, Award, Star, Activity, AlertCircle, ToggleLeft, ToggleRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, activeDoctor } = useDemo();

  // Availability state
  const [isDutyActive, setIsDutyActive] = useState(true);

  const doctorAppts = appointments.filter(
    a => a.doctorId === activeDoctor.id && a.status === 'upcoming'
  );

  const completedCount = appointments.filter(
    a => a.doctorId === activeDoctor.id && a.status === 'completed'
  ).length;

  const totalEarnings = appointments
    .filter(a => a.doctorId === activeDoctor.id && a.status === 'completed')
    .reduce((sum, a) => sum + a.fee, 0);

  const handleStartConsultation = (apptId: string) => {
    localStorage.setItem('demo_doctor_consulting_appt_id', apptId);
    navigate('/doctor/consultation');
  };

  const handleToggleDuty = () => {
    setIsDutyActive(prev => !prev);
    if (!isDutyActive) {
      confetti({
        particleCount: 50,
        spread: 30,
        origin: { y: 0.85 }
      });
    }
  };

  return (
    <div className="space-y-6 text-left pb-20 select-none">
      
      {/* Roster & Availability Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-805 dark:text-white leading-tight">Welcome, {activeDoctor.name}</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            {isDutyActive 
              ? 'On-duty: Accepting booking slots' 
              : 'Off-duty: Calendar roster blocked'
            }
          </span>
        </div>
        
        {/* Toggle button */}
        <button
          onClick={handleToggleDuty}
          className="p-1 cursor-pointer transition-transform"
        >
          {isDutyActive ? (
            <ToggleRight size={40} className="text-blue-600" />
          ) : (
            <ToggleLeft size={40} className="text-slate-400" />
          )}
        </button>
      </div>

      {/* Roster counts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold block uppercase">Today Queue</span>
          <span className="text-lg font-black text-slate-808 dark:text-white block mt-1">{doctorAppts.length} Patients</span>
          <span className="text-[9px] text-slate-500 mt-1.5 block">Waiting consult</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold block uppercase">Today Earnings</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block mt-1">₹{totalEarnings + 400}</span>
          <span className="text-[9px] text-slate-500 mt-1.5 block">Payout processing</span>
        </div>
      </div>

      {/* Patient Queue Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-808 dark:text-white text-sm">Consultation Patient Queue</h3>

        {doctorAppts.length === 0 ? (
          <div className="bg-slate-105 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805 rounded-3xl py-10 text-center text-slate-500 dark:text-slate-400 text-xs font-semibold">
            All appointments completed!
          </div>
        ) : (
          <div className="space-y-3">
            {doctorAppts.map((appt, idx) => (
              <div 
                key={appt.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 text-left"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center font-black text-xs shrink-0">
                      Q-{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{appt.patientName}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{appt.timeSlot} • Video Mode</span>
                    </div>
                  </div>
                  
                  <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase">
                    Awaiting
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase">Symptom Context</span>
                  <p className="text-xs text-slate-655 dark:text-slate-300 mt-0.5 italic">"{appt.reason}"</p>
                </div>

                <button
                  onClick={() => handleStartConsultation(appt.id)}
                  className="w-full bg-blue-600 text-white font-bold text-xs py-3.5 rounded-2xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlayCircle size={14} />
                  <span>Launch consultation</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
