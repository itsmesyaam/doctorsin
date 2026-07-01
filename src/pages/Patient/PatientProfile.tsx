import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { User, Mail, Phone, Calendar, Heart, Shield, CheckCircle } from 'lucide-react';

export const PatientProfile: React.FC = () => {
  const { activePatient } = useDemo();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 text-left max-w-3xl">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Personal Profile</h2>
        <p className="text-xs text-slate-500 mt-1">Manage your health demographics, allergies list, and verified contact cards.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left Card: Summary */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-center space-y-4 shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
            alt={activePatient.name} 
            className="h-24 w-24 rounded-3xl object-cover mx-auto shadow-md border border-slate-100"
          />
          <div>
            <h4 className="font-bold text-slate-800 text-base">{activePatient.name}</h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Patient Account</span>
          </div>
          
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-400 block font-semibold uppercase">Blood Group</span>
              <span className="font-extrabold text-slate-800">{activePatient.bloodType}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-400 block font-semibold uppercase">Patient Age</span>
              <span className="font-extrabold text-slate-800">{activePatient.age} yrs</span>
            </div>
          </div>
        </div>

        {/* Right Card: Editor */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">Personal Details</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Full Name</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <User size={14} className="text-slate-400" />
                  <input type="text" defaultValue={activePatient.name} className="bg-transparent border-none outline-none w-full font-medium" />
                </div>
              </div>
              
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-455 uppercase">Email Address</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <Mail size={14} className="text-slate-400" />
                  <input type="email" defaultValue={activePatient.email} className="bg-transparent border-none outline-none w-full font-medium" />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-455 uppercase">Phone Number</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <Phone size={14} className="text-slate-400" />
                  <input type="text" defaultValue={activePatient.phone} className="bg-transparent border-none outline-none w-full font-medium" />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-455 uppercase">Gender</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <User size={14} className="text-slate-400" />
                  <input type="text" defaultValue={activePatient.gender} className="bg-transparent border-none outline-none w-full font-medium" />
                </div>
              </div>
            </div>

            {/* Medical History Metadata */}
            <div className="pt-6 space-y-4 text-left">
              <h3 className="font-bold text-slate-805 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">Clinical Metadata</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-450 uppercase block mb-1.5">Medical History</span>
                  <div className="flex gap-2 flex-wrap">
                    {activePatient.medicalHistory.map((h, i) => (
                      <span key={i} className="text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1 rounded-xl flex items-center gap-1.5">
                        <Heart size={12} />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-450 uppercase block mb-1.5">Allergies List</span>
                  <div className="flex gap-2 flex-wrap">
                    {activePatient.allergies.map((a, i) => (
                      <span key={i} className="text-xs font-semibold bg-amber-50 border border-amber-100 text-amber-600 px-3 py-1 rounded-xl flex items-center gap-1.5">
                        <Shield size={12} />
                        <span>{a}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              {isSaved ? (
                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle size={16} />
                  <span>Changes saved successfully</span>
                </span>
              ) : <span />}
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
