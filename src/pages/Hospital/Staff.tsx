import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Users, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export const Staff: React.FC = () => {
  const { doctors, activeHospital } = useDemo();
  
  // Filter active doctors affiliated to this clinic
  const hospitalDoctors = doctors.filter(
    d => d.hospitalId === activeHospital.id && d.status === 'active'
  );

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Physician & Roster Directory</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review active clinicians, duty rosters, and department shift assignments.</p>
      </div>

      {/* Staff directory table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">On-duty Clinicians</h3>
          <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {hospitalDoctors.length} Active Staff
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase">
                <th className="p-4">Physician Name</th>
                <th className="p-4">Specialty</th>
                <th className="p-4">Consultation Fee</th>
                <th className="p-4">Rating Index</th>
                <th className="p-4">Duty Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
              {hospitalDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={doc.imageUrl} 
                      alt={doc.name} 
                      className="h-9 w-9 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-805 dark:text-white block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">ID: {doc.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-655 dark:text-slate-300 font-semibold">{doc.specialty}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-white">${doc.fee}</td>
                  <td className="p-4 text-amber-550 font-bold">★ {doc.rating}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                      {doc.availability.days.join(', ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
