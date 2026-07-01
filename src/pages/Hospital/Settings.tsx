import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { Building2, MapPin, Star, ShieldCheck, CheckCircle } from 'lucide-react';
import { MedicalAvatar } from '../../components/MedicalAvatar';

export const Settings: React.FC = () => {
  const { activeHospital } = useDemo();
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
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Facility Configurations</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure your clinical departments roster, physical street address, and active contacts.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left Info Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-sm">
          <div className="h-28 w-full rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <MedicalAvatar name={activeHospital.name} type="hospital" size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-tight">{activeHospital.name}</h4>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Kochi Division</span>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
              <span className="text-[9px] text-slate-400 block font-semibold uppercase">Rating</span>
              <span className="font-extrabold text-slate-800 dark:text-white">{activeHospital.rating} ★</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-955 p-2.5 rounded-xl border border-slate-100 dark:border-slate-855">
              <span className="text-[9px] text-slate-400 block font-semibold uppercase">Approval</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block truncate">LICENSED</span>
            </div>
          </div>
        </div>

        {/* Right Form Editor */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">Facility Parameters</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left col-span-2">
                <label className="text-[10px] font-bold text-slate-455 uppercase">Hospital License Name</label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs">
                  <Building2 size={14} className="text-slate-400" />
                  <input type="text" defaultValue={activeHospital.name} className="bg-transparent border-none outline-none w-full font-bold text-slate-800 dark:text-white" />
                </div>
              </div>

              <div className="space-y-1.5 text-left col-span-2">
                <label className="text-[10px] font-bold text-slate-455 uppercase">Street Location Address</label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs">
                  <MapPin size={14} className="text-slate-400" />
                  <input type="text" defaultValue={activeHospital.address} className="bg-transparent border-none outline-none w-full font-medium dark:text-white" />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              {isSaved ? (
                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle size={16} />
                  <span>Config saved</span>
                </span>
              ) : <span />}
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
