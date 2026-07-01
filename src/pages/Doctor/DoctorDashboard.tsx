import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { 
  Users, Calendar, Clock, Heart, PlayCircle, 
  TrendingUp, Award, Star, Activity, AlertCircle 
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, activeDoctor } = useDemo();

  // Filter today's appointments for this doctor (upcoming)
  const todayStr = new Date().toISOString().split('T')[0];
  
  const doctorAppts = appointments.filter(
    a => a.doctorId === activeDoctor.id && a.status === 'upcoming'
  );

  const completedCount = appointments.filter(
    a => a.doctorId === activeDoctor.id && a.status === 'completed'
  ).length;

  const totalEarnings = appointments
    .filter(a => a.doctorId === activeDoctor.id && a.status === 'completed')
    .reduce((sum, a) => sum + a.fee, 0);

  const docStats = [
    { name: 'Today Queue', value: `${doctorAppts.length} Patients`, label: 'Awaiting consult', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { name: 'Completed Today', value: `${completedCount}`, label: 'Sessions completed', icon: Award, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { name: 'Weekly Earnings', value: `$${totalEarnings + 2400}`, label: 'Payout pending', icon: TrendingUp, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
    { name: 'Patient Feedback', value: `${activeDoctor.rating} ★`, label: `From ${activeDoctor.reviewsCount} reviews`, icon: Star, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }
  ];

  const handleStartConsultation = (apptId: string) => {
    localStorage.setItem('demo_doctor_consulting_appt_id', apptId);
    navigate('/doctor/consultation');
  };

  return (
    <div className="space-y-8 text-left">
      {/* Welcome banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Welcome, {activeDoctor.name}</h2>
          <p className="text-slate-555 dark:text-slate-400 text-sm mt-1">
            You have <strong className="text-blue-600 dark:text-blue-400 font-bold">{doctorAppts.length} consultations scheduled</strong> for today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 p-2.5 rounded-xl">
          <Activity size={16} className="text-emerald-500 shrink-0" />
          <span>Clinic Roster Active</span>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {docStats.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.name} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
              <div className={`h-10 w-10 rounded-xl ${st.color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{st.name}</span>
                <span className="text-xl font-black text-slate-805 dark:text-white block mt-0.5">{st.value}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">{st.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Waiting Patient Queue */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Awaiting Consultation Queue</h3>

        {doctorAppts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805 rounded-3xl py-12 text-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
            All appointments for today are cleared. Well done, Doctor!
          </div>
        ) : (
          <div className="space-y-4">
            {doctorAppts.map((appt, idx) => (
              <div 
                key={appt.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                    Q-{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-base">{appt.patientName}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-550 font-semibold mt-0.5 text-left">Reason: "{appt.reason}"</p>
                    
                    <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {appt.timeSlot}</span>
                      <span className="flex items-center gap-1.5">
                        {appt.type === 'video' ? (
                          <><PlayCircle size={14} className="text-blue-500" /> <span className="text-blue-605 dark:text-blue-400 font-bold">Telehealth Video</span></>
                        ) : (
                          <span>In-Clinic Consultation</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartConsultation(appt.id)}
                  className="bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <PlayCircle size={14} />
                  <span>Start Consultation</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
