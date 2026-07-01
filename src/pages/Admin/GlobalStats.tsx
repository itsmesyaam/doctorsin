import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  ShieldCheck, Users, Building2, CreditCard, 
  TrendingUp, Award, Activity, Heart, DollarSign, 
  Server, Cpu, Database 
} from 'lucide-react';

export const GlobalStats: React.FC = () => {
  const { doctors, hospitals, patients, appointments } = useDemo();

  // Platform aggregates
  const activeDoctors = doctors.filter(d => d.status === 'active');
  const activeHospitals = hospitals.filter(h => h.status === 'approved');
  
  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.fee, 0);

  const stats = [
    { name: 'Global Platform Revenue', value: `$${(totalRevenue + 45000).toLocaleString()}`, desc: 'Aggregated consult fees', icon: DollarSign, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { name: 'Total Patients Directory', value: `${patients.length} Users`, desc: 'Registered patient accounts', icon: Users, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { name: 'Affiliated Hospitals', value: `${activeHospitals.length} / ${hospitals.length}`, desc: 'Licensed medical complexes', icon: Building2, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
    { name: 'Verified Physicians', value: `${activeDoctors.length} / ${doctors.length}`, desc: 'Duty roster active', icon: ShieldCheck, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }
  ];

  const auditEvents = [
    { time: '12:58 PM', text: 'Invoice INV-48201 settled successfully ($800)' },
    { time: '12:54 PM', text: 'Dr. Haridas Nair signed prescription file Rx-a4' },
    { time: '12:49 PM', text: 'ICU Bed I-005 flagged for disinfection protocol' },
    { time: '12:42 PM', text: 'General Physician application verified: Dr. Vikram Sen' }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Super Administrator Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Global healthcare orchestration panel. Monitor licensing, commission margins, and system health status.
          </p>
        </div>
        <span className="bg-blue-50 dark:bg-blue-955 text-blue-600 dark:text-blue-400 border border-blue-150 dark:border-blue-900 text-xs px-3 py-1.5 rounded-xl font-bold uppercase shrink-0">
          Core Engine Stable
        </span>
      </div>

      {/* Grid widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.name} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-sm">
              <div className={`h-10 w-10 rounded-xl ${st.color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold block uppercase">{st.name}</span>
                <span className="text-xl font-black text-slate-805 dark:text-white block mt-0.5">{st.value}</span>
                <span className="text-[10px] text-slate-500 mt-1 block">{st.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enterprise System metrics & Audit Timeline */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* System Health */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-3xl p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
            <Server size={18} className="text-blue-600" />
            <span>Enterprise Infrastructure & Health</span>
          </h3>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'CPU Usage', val: '12.4%', sub: 'Load: Normal', icon: Cpu, pct: 12 },
              { label: 'RAM Occupancy', val: '4.2 GB / 16 GB', sub: 'Pool: Stable', icon: Database, pct: 26 },
              { label: 'Signaling Uptime', val: '99.98%', sub: 'Telehealth Active', icon: ShieldCheck, pct: 99 }
            ].map((srv, i) => {
              const Icon = srv.icon;
              return (
                <div key={i} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-3">
                  <div className="flex justify-between items-center">
                    <Icon size={16} className="text-slate-400" />
                    <span className="text-[9px] font-bold text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-150 dark:border-emerald-900/50">
                      ONLINE
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{srv.label}</span>
                    <span className="text-base font-extrabold text-slate-800 dark:text-white block mt-0.5">{srv.val}</span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${srv.pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-805 rounded-3xl p-6 space-y-4 shadow-sm text-left">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Platform Audit Timeline</h3>
          
          <div className="space-y-4">
            {auditEvents.map((ev, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  {i < auditEvents.length - 1 && <div className="w-0.5 bg-slate-200 dark:bg-slate-850 flex-1 my-1" />}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{ev.time}</span>
                  <p className="text-slate-655 dark:text-slate-300 font-medium leading-normal">{ev.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
