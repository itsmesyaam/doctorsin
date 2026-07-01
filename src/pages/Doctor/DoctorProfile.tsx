import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { User, Award, Stethoscope, Building2, DollarSign, Clock, CheckCircle } from 'lucide-react';

export const DoctorProfile: React.FC = () => {
  const { activeDoctor } = useDemo();
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
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Physician Profile</h2>
        <p className="text-xs text-slate-500 mt-1">Configure your clinic consultation fees, bio details, and active hospital affiliation settings.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Left Side: Summary Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 text-center space-y-4 shadow-sm">
          <img 
            src={activeDoctor.imageUrl} 
            alt={activeDoctor.name} 
            className="h-24 w-24 rounded-3xl object-cover mx-auto shadow-md border border-slate-100"
          />
          <div>
            <h4 className="font-bold text-slate-805 text-base">{activeDoctor.name}</h4>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
              {activeDoctor.specialty}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-400 block font-semibold uppercase">Rating</span>
              <span className="font-extrabold text-slate-800">{activeDoctor.rating} ★</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9px] text-slate-400 block font-semibold uppercase">Experience</span>
              <span className="font-extrabold text-slate-800">{activeDoctor.experience} yrs</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Editor */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">Professional Credentials</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Doctor Name</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <User size={14} className="text-slate-400" />
                  <input type="text" defaultValue={activeDoctor.name} className="bg-transparent border-none outline-none w-full font-semibold text-slate-800" />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Specialty Title</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <Stethoscope size={14} className="text-slate-400" />
                  <input type="text" defaultValue={activeDoctor.specialty} className="bg-transparent border-none outline-none w-full font-semibold text-slate-850" />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Clinic Affiliation</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <Building2 size={14} className="text-slate-400" />
                  <input type="text" defaultValue={activeDoctor.clinicName} className="bg-transparent border-none outline-none w-full font-medium" />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-450 uppercase">Consultation Fee ($)</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs">
                  <DollarSign size={14} className="text-slate-400" />
                  <input type="number" defaultValue={activeDoctor.fee} className="bg-transparent border-none outline-none w-full font-medium" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-left pt-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Professional Biography</label>
              <textarea
                rows={4}
                defaultValue={activeDoctor.bio}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs outline-none focus:border-blue-500 font-medium text-slate-655"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              {isSaved ? (
                <span className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <CheckCircle size={16} />
                  <span>Profile updated</span>
                </span>
              ) : <span />}
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
