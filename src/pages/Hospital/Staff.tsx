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
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Physician & Roster Directory</h2>
        <p className="text-xs text-slate-500 mt-1">Review active clinicians, duty rosters, and department shift assignments.</p>
      </div>

      {/* Staff directory table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">On-duty Clinicians</h3>
          <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {hospitalDoctors.length} Active Staff
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-105 text-[10px] text-slate-400 font-bold uppercase">
                <th className="p-4">Physician Name</th>
                <th className="p-4">Specialty</th>
                <th className="p-4">Consultation Fee</th>
                <th className="p-4">Rating Index</th>
                <th className="p-4">Duty Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {hospitalDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50">
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={doc.imageUrl} 
                      alt={doc.name} 
                      className="h-9 w-9 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-850 block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">ID: {doc.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-655 font-semibold">{doc.specialty}</td>
                  <td className="p-4 font-bold text-slate-800">${doc.fee}</td>
                  <td className="p-4 text-amber-550 font-bold">★ {doc.rating}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-xl text-[10px] font-bold">
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
