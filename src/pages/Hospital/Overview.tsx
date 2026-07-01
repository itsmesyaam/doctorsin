import React, { useState, useEffect } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  Users, BedDouble, Wallet, Award, 
  TrendingUp, Activity, Compass, Navigation 
} from 'lucide-react';

export const HospitalOverview: React.FC = () => {
  const { activeHospital } = useDemo();

  // Stats calculate
  const occupancyRate = ((activeHospital.bedsOccupied / activeHospital.bedsTotal) * 100).toFixed(0);
  const totalRevenue = activeHospital.revenue.reduce((sum, val) => sum + val, 0);

  const stats = [
    { name: 'Total Doctors Staff', value: `${activeHospital.doctorsCount} Specialists`, desc: 'Active duty shifts', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { name: 'Bed Occupancy', value: `${occupancyRate}%`, desc: `${activeHospital.bedsOccupied} / ${activeHospital.bedsTotal} occupied`, icon: BedDouble, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
    { name: 'Monthly Revenue', value: `$${activeHospital.revenue[5].toLocaleString()}`, desc: 'Gross earnings this month', icon: Wallet, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
    { name: 'Affiliation Rating', value: `${activeHospital.rating} ★`, desc: 'Patient feedback index', icon: Award, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }
  ];

  // Ambulance coordinates state
  const [ambOffset, setAmbOffset] = useState({ x: 40, y: 150 });
  const [ambStatus, setAmbStatus] = useState('AMB-402 approaching Kakkanad');
  const [eta, setEta] = useState(8);

  // Animate ambulance along a grid path
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbOffset(prev => {
        let nextX = prev.x + 8;
        let nextY = prev.y;
        
        if (nextX > 540) {
          nextX = 40;
          nextY = 150;
        } else if (nextX > 250 && nextX < 350) {
          nextY = 80; // simulate a turn
        } else {
          nextY = 150;
        }

        // ETA calculation based on position
        const remainingDist = 540 - nextX;
        const newEta = Math.max(1, Math.ceil(remainingDist / 60));
        setEta(newEta);

        if (newEta === 1) {
          setAmbStatus('AMB-402 arriving at Emergency Bay');
        } else if (nextX > 250) {
          setAmbStatus('AMB-402 routing via Marine Drive');
        } else {
          setAmbStatus('AMB-402 dispatched from Fort Kochi');
        }

        return { x: nextX, y: nextY };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // SVG Chart configurations
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 40;
  
  const maxRev = Math.max(...activeHospital.revenue) * 1.1;
  const points = activeHospital.revenue.map((val, i) => {
    const x = padding + (i * (svgWidth - padding * 2)) / (activeHospital.revenue.length - 1);
    const y = svgHeight - padding - (val * (svgHeight - padding * 2)) / maxRev;
    return { x, y, val };
  });

  const pathD = `M ${points[0].x} ${svgHeight - padding} ` + 
                points.map(p => `L ${p.x} ${p.y}`).join(' ') + 
                ` L ${points[points.length - 1].x} ${svgHeight - padding} Z`;

  const strokeD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="space-y-8 text-left">
      {/* Welcome banner */}
      <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:border-slate-800">
        <div className="text-left">
          <h2 className="text-2xl font-black text-slate-805 dark:text-white tracking-tight">Admin Console: {activeHospital.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Affiliated to DOCTORSIN network since 2024. All departments report normal status levels.
          </p>
        </div>
        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-900/50 text-xs px-3 py-1.5 rounded-xl font-bold uppercase shrink-0">
          Licensing Approved
        </span>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st) => {
          const Icon = st.icon;
          return (
            <div key={st.name} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl space-y-3 shadow-sm">
              <div className={`h-10 w-10 rounded-xl ${st.color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{st.name}</span>
                <span className="text-xl font-black text-slate-805 dark:text-white block mt-0.5">{st.value}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">{st.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Charts & Operations */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* SVG Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-855 dark:text-white text-base">Facility Gross Revenue</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Aggregate earnings across all clinical departments</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full font-bold">
              <TrendingUp size={14} />
              <span>+6.2% Average MoM</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full min-w-[500px] h-auto overflow-visible select-none"
            >
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#e2e8f0" strokeWidth="1.5" />
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="4 4" />
              
              <defs>
                <linearGradient id="areaGradHosp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path d={pathD} fill="url(#areaGradHosp)" />
              <path d={strokeD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#10b981" strokeWidth="2.5" />
                  <text 
                    x={p.x} 
                    y={p.y - 12} 
                    textAnchor="middle" 
                    className="text-[9px] font-extrabold fill-slate-800 dark:fill-slate-200"
                  >
                    ${(p.val / 1000).toFixed(0)}k
                  </text>
                </g>
              ))}

              {months.map((m, i) => {
                const x = padding + (i * (svgWidth - padding * 2)) / (months.length - 1);
                return (
                  <text 
                    key={m} 
                    x={x} 
                    y={svgHeight - 15} 
                    textAnchor="middle" 
                    className="text-[10px] font-semibold fill-slate-400"
                  >
                    {m}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Live Ambulance Radar & Dispatch panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
              <Compass size={16} className="text-red-500 animate-spin-slow" />
              <span>Emergency Radar</span>
            </h3>
            <span className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
              1 Active Dispatch
            </span>
          </div>

          {/* SVG Map Grid */}
          <div className="h-44 bg-slate-50 dark:bg-slate-950/60 rounded-2xl relative border border-slate-100 dark:border-slate-850 overflow-hidden flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 600 200" className="w-full h-full stroke-slate-200 dark:stroke-slate-800 stroke-1 fill-none select-none">
              {/* Map grid streets */}
              <line x1="40" y1="40" x2="560" y2="40" />
              <line x1="40" y1="150" x2="560" y2="150" />
              <line x1="250" y1="40" x2="250" y2="150" />
              <line x1="420" y1="40" x2="420" y2="150" />
              
              {/* Hospital Endpoint node */}
              <circle cx="540" cy="150" r="10" className="fill-blue-500/20 stroke-blue-500 stroke-2" />
              <text x="540" y="132" textAnchor="middle" className="text-[9px] font-bold fill-blue-600 dark:fill-blue-400">ER</text>

              {/* Moving Ambulance dot */}
              <circle cx={ambOffset.x} cy={ambOffset.y} r="6" className="fill-red-500 stroke-white stroke-2 animate-pulse" />
            </svg>
            
            {/* Compass pointer decoration */}
            <div className="absolute top-3 right-3 text-slate-400">
              <Navigation size={14} className="rotate-45" />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Status updates</span>
            <div className="flex justify-between items-center font-bold text-slate-700 dark:text-slate-300">
              <span className="truncate">{ambStatus}</span>
              <span className="text-red-500 shrink-0">ETA {eta}m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
