import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { DollarSign, Award, Users, Star, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { activeDoctor } = useDemo();

  // Monthly breakdown mock (Jan - Jun)
  const earningsData = [3200, 3900, 3600, 4800, 5200, 5800];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  const totalEarnings = earningsData.reduce((sum, val) => sum + val, 0);

  // SVG dimensions for a premium vector chart
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 40;
  
  // Calculate coordinate nodes for custom SVG area chart
  const maxVal = Math.max(...earningsData) * 1.1;
  const points = earningsData.map((val, i) => {
    const x = padding + (i * (svgWidth - padding * 2)) / (earningsData.length - 1);
    const y = svgHeight - padding - (val * (svgHeight - padding * 2)) / maxVal;
    return { x, y, val };
  });

  const pathD = `M ${points[0].x} ${svgHeight - padding} ` + 
                points.map(p => `L ${p.x} ${p.y}`).join(' ') + 
                ` L ${points[points.length - 1].x} ${svgHeight - padding} Z`;

  const strokeD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Earnings & Clinical Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review revenue stats, consult volume, ratings analysis, and commission breakdowns.</p>
      </div>

      {/* Grid Overview widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { name: 'Total Revenue', value: `$${totalEarnings}`, desc: 'Gross payout', icon: DollarSign, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
          { name: 'Avg Consultation Fee', value: `$${activeDoctor.fee}`, desc: 'In-clinic mode', icon: Award, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
          { name: 'Consultations Count', value: '184 sessions', desc: 'Last 6 months', icon: Users, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
          { name: 'Satisfaction Index', value: '4.8 / 5.0', desc: 'Top 5% in hospital', icon: Star, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }
        ].map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
              <div className={`h-10 w-10 rounded-xl ${st.color} flex items-center justify-center`}>
                <Icon size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{st.name}</span>
                <span className="text-xl font-black text-slate-808 dark:text-white block mt-0.5">{st.value}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">{st.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Earnings Chart SVG */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">Monthly Revenue Trend</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Consultation earnings over the last 6 months</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full font-bold">
              <TrendingUp size={14} />
              <span>+18.4% MoM</span>
            </div>
          </div>

          {/* SVG Vector Chart */}
          <div className="w-full overflow-x-auto">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full min-w-[500px] h-auto overflow-visible select-none"
            >
              {/* Grid Lines */}
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} className="stroke-slate-100 dark:stroke-slate-900" strokeDasharray="4 4" />
              
              {/* Fill Area Gradient */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Path */}
              <path d={pathD} fill="url(#areaGrad)" />
              
              {/* Stroke Path */}
              <path d={strokeD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Point Nodes */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                  <text 
                    x={p.x} 
                    y={p.y - 12} 
                    textAnchor="middle" 
                    className="text-[10px] font-bold fill-slate-805 dark:fill-slate-205"
                  >
                    ${p.val}
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
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

        {/* Right card: Patient ratings & feedback */}
        <div className="bg-white dark:bg-slate-900 border border-slate-202/85 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-sm text-left">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">Ratings Summary</h3>
          
          <div className="flex items-center gap-4">
            <h4 className="text-4xl font-black text-slate-800 dark:text-white">{activeDoctor.rating}</h4>
            <div>
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill={i < 4 ? 'currentColor' : 'none'} stroke="currentColor" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-semibold block mt-1">Based on {activeDoctor.reviewsCount} verified patients</span>
            </div>
          </div>

          <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-850 pt-4 text-xs">
            {[
              { label: '5 Star reviews', percent: 84 },
              { label: '4 Star reviews', percent: 12 },
              { label: '3 Star reviews', percent: 3 },
              { label: 'Under 3 Stars', percent: 1 }
            ].map((rat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-655 dark:text-slate-400 text-[11px]">
                  <span>{rat.label}</span>
                  <span>{rat.percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${rat.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
