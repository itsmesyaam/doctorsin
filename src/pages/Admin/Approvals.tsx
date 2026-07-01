import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ShieldCheck, Award, Stethoscope, Building2, MapPin, Check, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Approvals: React.FC = () => {
  const { doctors, hospitals, verifyDoctor, approveHospital } = useDemo();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Filter pending items
  const pendingDoctors = doctors.filter(d => d.status === 'pending');
  const pendingHospitals = hospitals.filter(h => h.status === 'pending');

  const handleApproveDoctor = (docId: string) => {
    setLoadingId(docId);
    setTimeout(() => {
      verifyDoctor(docId);
      setLoadingId(null);
    }, 600);
  };

  const handleApproveHospital = (hospId: string) => {
    setLoadingId(hospId);
    setTimeout(() => {
      approveHospital(hospId);
      setLoadingId(null);
    }, 600);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Verification Queues</h2>
        <p className="text-xs text-slate-500 mt-1">Review credentials of clinicians and clinics seeking network licensing approval.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Pending Doctors List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-850 text-base">Clinician Registrations</h3>
            <span className="bg-amber-50 border border-amber-150 text-amber-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {pendingDoctors.length} Awaiting
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {pendingDoctors.length === 0 ? (
                <div className="bg-white border border-slate-200/60 rounded-3xl py-12 text-center text-slate-500 text-xs font-semibold">
                  No pending clinician verifications.
                </div>
              ) : (
                pendingDoctors.map((doc) => (
                  <motion.div 
                    key={doc.id}
                    layout
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-48"
                  >
                    <div className="flex gap-4 text-left">
                      <img 
                        src={doc.imageUrl} 
                        alt={doc.name} 
                        className="h-14 w-14 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-150 px-2 py-0.5 rounded-full uppercase">
                          Pending Verification
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm mt-1.5">{doc.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{doc.specialty} • {doc.experience} Yrs Exp</p>
                        <p className="text-[10px] text-slate-500 italic mt-2 truncate max-w-[280px]">"{doc.bio.slice(0, 80)}..."</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        onClick={() => handleApproveDoctor(doc.id)}
                        disabled={loadingId === doc.id}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {loadingId === doc.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        <span>Approve License</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pending Hospitals List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-850 text-base">Facility Affiliations</h3>
            <span className="bg-amber-50 border border-amber-155 text-amber-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {pendingHospitals.length} Awaiting
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {pendingHospitals.length === 0 ? (
                <div className="bg-white border border-slate-205/60 rounded-3xl py-12 text-center text-slate-500 text-xs font-semibold">
                  No pending hospital network approvals.
                </div>
              ) : (
                pendingHospitals.map((hosp) => (
                  <motion.div 
                    key={hosp.id}
                    layout
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-48"
                  >
                    <div className="text-left space-y-2">
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-150 px-2 py-0.5 rounded-full uppercase">
                        Pending License
                      </span>
                      <h4 className="font-bold text-slate-805 text-sm">{hosp.name}</h4>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="truncate">{hosp.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Building2 size={14} className="text-slate-400 shrink-0" />
                        <span>Beds Pool: {hosp.bedsTotal} total slots</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        onClick={() => handleApproveHospital(hosp.id)}
                        disabled={loadingId === hosp.id}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {loadingId === hosp.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        <span>Approve Facility</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
