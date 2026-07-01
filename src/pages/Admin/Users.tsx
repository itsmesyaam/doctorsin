import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Users, Mail, Phone, Shield } from 'lucide-react';

export const UsersDirectory: React.FC = () => {
  const { doctors, patients } = useDemo();

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-805 tracking-tight">System User Directory</h2>
        <p className="text-xs text-slate-500 mt-1">Review, filter, and audit all active accounts on the DOCTORSIN platform.</p>
      </div>

      {/* Directory list tables */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-105 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Active System Users</h3>
          <span className="bg-blue-50 text-blue-650 text-xs px-2.5 py-0.5 rounded-full font-bold">
            {patients.length + doctors.length} Total Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-105 text-[10px] text-slate-400 font-bold uppercase">
                <th className="p-4">User Name</th>
                <th className="p-4">Role Classification</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Reference Key</th>
                <th className="p-4">Verification Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {/* Alexander Fleming patient first */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                    AF
                  </div>
                  <div>
                    <span className="font-bold text-slate-850 block">Alexander Fleming</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Male • 29 yrs</span>
                  </div>
                </td>
                <td className="p-4 text-slate-655 font-semibold capitalize">Patient</td>
                <td className="p-4 space-y-1">
                  <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> patient@doctorsin.com</span>
                  <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> +91 9876543210</span>
                </td>
                <td className="p-4 font-mono text-slate-400">pat-active</td>
                <td className="p-4">
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-150">
                    VERIFIED
                  </span>
                </td>
              </tr>

              {/* Seed other active doctors */}
              {doctors.slice(0, 5).map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50">
                  <td className="p-4 flex items-center gap-3">
                    <img 
                      src={doc.imageUrl} 
                      alt={doc.name} 
                      className="h-9 w-9 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-slate-850 block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{doc.specialty}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-655 font-semibold capitalize">Clinician</td>
                  <td className="p-4 space-y-1">
                    <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> doc-{doc.id.split('-')[1]}@doctorsin.com</span>
                    <span className="flex items-center gap-1"><Shield size={12} className="text-slate-400" /> Affiliated: {doc.hospitalName.slice(0, 20)}...</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{doc.id}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                      doc.status === 'active'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-150'
                        : 'bg-amber-50 text-amber-600 border-amber-150'
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
