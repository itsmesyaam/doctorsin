import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Users, Mail, Phone, Shield, ShieldCheck } from 'lucide-react';

export const UsersDirectory: React.FC = () => {
  const { doctors, patients } = useDemo();

  return (
    <div className="space-y-6 text-left pb-20 select-none">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">System User Directory</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review, filter, and audit active clinician and patient accounts.</p>
      </div>

      {/* Directory count header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <h3 className="font-bold text-slate-805 dark:text-white text-xs uppercase tracking-wider">Account Database</h3>
        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-605 dark:text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
          {patients.length + doctors.length} Registered Accounts
        </span>
      </div>

      {/* Directory list of cards (No Tables on mobile) */}
      <div className="space-y-4">
        {/* Patient card (Alexander Fleming) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4 text-left">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-blue-50 dark:bg-blue-955/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                AF
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-tight">Alexander Fleming</h4>
                <span className="text-[10px] text-slate-400 block mt-0.5">Male • 29 yrs</span>
              </div>
            </div>
            
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full uppercase">
              Patient
            </span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs text-slate-655 dark:text-slate-300">
            <div className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> patient@doctorsin.com</div>
            <div className="flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> +91 9876543210</div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px]">
            <span className="font-mono text-slate-400">Ref: pat-active</span>
            <span className="bg-emerald-55 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-150 dark:border-emerald-900/50">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Doctor cards */}
        {doctors.slice(0, 5).map((doc) => (
          <div 
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4 text-left"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <img 
                  src={doc.imageUrl} 
                  alt={doc.name} 
                  className="h-10 w-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{doc.name}</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{doc.specialty}</span>
                </div>
              </div>
              
              <span className="text-[9px] font-bold text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full uppercase">
                Clinician
              </span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs text-slate-655 dark:text-slate-300">
              <div className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> doc-{doc.id.split('-')[1]}@doctorsin.com</div>
              <div className="flex items-center gap-1.5"><Shield size={12} className="text-slate-400" /> Affiliated: {doc.hospitalName.slice(0, 24)}...</div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px]">
              <span className="font-mono text-slate-400">Ref: {doc.id}</span>
              <span className={`px-2 py-0.5 rounded font-bold border ${
                doc.status === 'active'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-150 dark:border-emerald-900/50'
                  : 'bg-amber-50 dark:bg-amber-955 text-amber-600 dark:text-amber-400 border-amber-150 dark:border-amber-900'
              }`}>
                {doc.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
