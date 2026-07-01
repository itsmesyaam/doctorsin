import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Users, Mail, Phone, Shield } from 'lucide-react';

export const UsersDirectory: React.FC = () => {
  const { doctors, patients } = useDemo();

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">System User Directory</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review, filter, and audit all active accounts on the DOCTORSIN platform.</p>
      </div>

      {/* Directory list tables */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Active System Users</h3>
          <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {patients.length + doctors.length} Total Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase">
                <th className="p-4">User Name</th>
                <th className="p-4">Role Classification</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Reference Key</th>
                <th className="p-4">Verification Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
              {/* Alexander Fleming patient first */}
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                <td className="p-4 flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                    AF
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white block">Alexander Fleming</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 text-left">Male • 29 yrs</span>
                  </div>
                </td>
                <td className="p-4 text-slate-655 dark:text-slate-300 font-semibold capitalize">Patient</td>
                <td className="p-4 space-y-1 text-left">
                  <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> patient@doctorsin.com</span>
                  <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> +91 9876543210</span>
                </td>
                <td className="p-4 font-mono text-slate-400">pat-active</td>
                <td className="p-4">
                  <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-150 dark:border-emerald-900/50">
                    VERIFIED
                  </span>
                </td>
              </tr>

              {/* Seed other active doctors */}
              {doctors.slice(0, 5).map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={doc.imageUrl} 
                      alt={doc.name} 
                      className="h-9 w-9 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-805 dark:text-white block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 text-left">{doc.specialty}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-655 dark:text-slate-300 font-semibold capitalize">Clinician</td>
                  <td className="p-4 space-y-1 text-left">
                    <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> doc-{doc.id.split('-')[1]}@doctorsin.com</span>
                    <span className="flex items-center gap-1"><Shield size={12} className="text-slate-400" /> Affiliated: {doc.hospitalName.slice(0, 20)}...</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{doc.id}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      doc.status === 'active'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-605 dark:text-emerald-450 border-emerald-150 dark:border-emerald-900/50'
                        : 'bg-amber-50 dark:bg-amber-955 border-amber-150 dark:border-amber-900'
                    }`}>
                      {doc.status.toUpperCase()}
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
