import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Users, ShieldCheck, Mail, Phone, Calendar, Star, Award } from 'lucide-react';
import { MedicalAvatar } from '../../components/MedicalAvatar';

export const Staff: React.FC = () => {
  const { doctors, activeHospital } = useDemo();
  
  // Filter active doctors affiliated to this clinic
  const hospitalDoctors = doctors.filter(
    d => d.hospitalId === activeHospital.id && d.status === 'active'
  );

  return (
    <div className="space-y-6 text-left pb-20 select-none">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Clinician Staff Directory</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review active clinicians, department shifts, and duty assignments.</p>
      </div>

      {/* Directory counts header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Affiliated Physicians</h3>
        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
          {hospitalDoctors.length} Active Staff
        </span>
      </div>

      {/* Staff directory card list (No Tables on mobile) */}
      <div className="space-y-4">
        {hospitalDoctors.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between gap-4 text-left"
          >
            <div className="flex gap-4">
              <MedicalAvatar name={doc.name} type="doctor" specialty={doc.specialty} size={14} />
              <div className="space-y-0.5 text-left">
                <span className="text-[9px] font-bold text-blue-650 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {doc.specialty}
                </span>
                <h4 className="font-bold text-slate-805 dark:text-white text-sm mt-1">{doc.name}</h4>
                <p className="text-[10px] text-slate-400">ID: {doc.id} • {doc.experience} Yrs Experience</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-500 dark:text-slate-400">
              <div>
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Consultation Fee</span>
                <span className="font-extrabold text-slate-800 dark:text-white mt-0.5 block">${doc.fee}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Satisfaction Index</span>
                <span className="font-extrabold text-amber-550 mt-0.5 block flex items-center gap-0.5">
                  <Star size={11} className="fill-amber-500 text-amber-500" />
                  {doc.rating}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-[10px]">
              <span className="text-[9px] text-slate-400 block font-bold uppercase mb-1.5">Duty Schedule</span>
              <div className="flex gap-1.5 flex-wrap">
                {doc.availability.days.map((day) => (
                  <span key={day} className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg font-bold">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
