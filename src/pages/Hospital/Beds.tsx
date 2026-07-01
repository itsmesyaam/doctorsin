import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { BedDouble, AlertCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Bed {
  id: number;
  label: string;
  type: 'ICU' | 'General' | 'Recovery';
  status: 'available' | 'occupied' | 'cleaning';
  patientName?: string;
  admitDate?: string;
}

export const Beds: React.FC = () => {
  const { activeHospital, allocateBed, dischargeBed } = useDemo();
  
  const [bedsGrid, setBedsGrid] = useState<Bed[]>(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const id = i + 1;
      let type: Bed['type'] = 'General';
      if (id <= 6) type = 'ICU';
      else if (id >= 19) type = 'Recovery';

      let status: Bed['status'] = 'available';
      let patientName = undefined;
      let admitDate = undefined;

      if (id === 1 || id === 3 || id === 7 || id === 10 || id === 15 || id === 20) {
        status = 'occupied';
        patientName = ['John Smith', 'Sarah Connor', 'Peter Parker', 'Bruce Wayne', 'Clark Kent', 'Diana Prince'][id % 6];
        admitDate = '2026-06-28';
      } else if (id === 5 || id === 12) {
        status = 'cleaning';
      }

      return {
        id,
        label: `${type.charAt(0)}-${id.toString().padStart(3, '0')}`,
        type,
        status,
        patientName,
        admitDate
      };
    });
  });

  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [patientInput, setPatientInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const occupiedCount = bedsGrid.filter(b => b.status === 'occupied').length;
  const cleaningCount = bedsGrid.filter(b => b.status === 'cleaning').length;
  const availableCount = bedsGrid.length - occupiedCount - cleaningCount;

  const handleBedClick = (bed: Bed) => {
    setSelectedBed(bed);
  };

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed || !patientInput.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setBedsGrid(prev => prev.map(b => {
        if (b.id === selectedBed.id) {
          return {
            ...b,
            status: 'occupied',
            patientName: patientInput,
            admitDate: new Date().toISOString().split('T')[0]
          };
        }
        return b;
      }));

      allocateBed(activeHospital.id, 1);
      
      setIsSubmitting(false);
      setSelectedBed(null);
      setPatientInput('');
    }, 600);
  };

  const handleDischarge = () => {
    if (!selectedBed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setBedsGrid(prev => prev.map(b => {
        if (b.id === selectedBed.id) {
          return { ...b, status: 'cleaning', patientName: undefined, admitDate: undefined };
        }
        return b;
      }));

      dischargeBed(activeHospital.id, 1);

      setIsSubmitting(false);
      setSelectedBed(null);

      const bedId = selectedBed.id;
      setTimeout(() => {
        setBedsGrid(prev => prev.map(b => {
          if (b.id === bedId) {
            return { ...b, status: 'available' };
          }
          return b;
        }));
      }, 4000);

    }, 600);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Clinical Bed Management</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Allocate ICU ventilators, general wards, or surgical recovery units in real time.</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-6 max-w-2xl">
        {[
          { name: 'Available Wards', value: availableCount, color: 'text-emerald-605 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' },
          { name: 'Occupied Units', value: occupiedCount, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20' },
          { name: 'Cleaning/Sanitizing', value: cleaningCount, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20' }
        ].map((met, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">{met.name}</span>
            <span className={`text-xl font-black block mt-1 ${met.color.split(' ')[0]}`}>{met.value} Beds</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex-wrap">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-500 block" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-rose-500 block" /> Occupied</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-amber-500 block" /> Sanitizing (Auto-resets in 4s)</span>
      </div>

      {/* Beds Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-4">
        {bedsGrid.map((bed) => {
          const colorClass = 
            bed.status === 'occupied' 
              ? 'bg-rose-50 dark:bg-rose-950/25 border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100/50 dark:hover:bg-rose-900/30' 
              : bed.status === 'cleaning'
              ? 'bg-amber-50 dark:bg-amber-950/25 border-amber-200/80 dark:border-amber-900/50 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 animate-pulse'
              : 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-200/80 dark:border-emerald-900/50 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30';

          const indicatorClass = 
            bed.status === 'occupied' 
              ? 'bg-rose-500' 
              : bed.status === 'cleaning'
              ? 'bg-amber-500'
              : 'bg-emerald-500';

          return (
            <button
              key={bed.id}
              onClick={() => handleBedClick(bed)}
              className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between items-center h-24 shadow-sm ${colorClass}`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[9px] font-bold text-slate-450 uppercase">{bed.type}</span>
                <span className={`h-2 w-2 rounded-full ${indicatorClass}`} />
              </div>
              
              <BedDouble size={20} className={bed.status === 'occupied' ? 'text-rose-600' : bed.status === 'cleaning' ? 'text-amber-600' : 'text-emerald-600'} />
              
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">{bed.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bed Manage Modal */}
      <AnimatePresence>
        {selectedBed && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBed(null)}
              className="absolute inset-0 bg-slate-900"
            />
            
            <motion.div
              initial={{ opacity: 0, y: window.innerWidth < 640 ? '100%' : 20, scale: window.innerWidth < 640 ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: window.innerWidth < 640 ? '100%' : 20, scale: window.innerWidth < 640 ? 1 : 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[2rem] sm:rounded-3xl shadow-2xl p-6 z-10"
            >
              <button 
                onClick={() => setSelectedBed(null)}
                className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              >
                <X size={16} />
              </button>

              <div className="text-left space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
                    <BedDouble size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Manage Bed {selectedBed.label}</h4>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      {selectedBed.type} Ward unit
                    </span>
                  </div>
                </div>

                {/* Available -> Allocate */}
                {selectedBed.status === 'available' && (
                  <form onSubmit={handleAllocate} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-450 uppercase">Patient Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Arthur Dent"
                        value={patientInput}
                        onChange={(e) => setPatientInput(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500 font-semibold dark:text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !patientInput.trim()}
                      className="w-full bg-blue-600 text-white font-bold text-xs py-3.5 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
                      <span>Allocate Bed</span>
                    </button>
                  </form>
                )}

                {/* Occupied -> Discharge */}
                {selectedBed.status === 'occupied' && (
                  <div className="space-y-4 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Occupant</span>
                        <span className="font-bold text-slate-800 dark:text-white">{selectedBed.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Admit Date</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-300">{selectedBed.admitDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDischarge}
                      disabled={isSubmitting}
                      className="w-full bg-rose-600 text-white font-bold text-xs py-3.5 rounded-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
                      <span>Discharge Patient</span>
                    </button>
                  </div>
                )}

                {/* Cleaning */}
                {selectedBed.status === 'cleaning' && (
                  <div className="space-y-4 pt-2 text-center py-4">
                    <AlertCircle size={32} className="mx-auto text-amber-500 animate-pulse" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      This bed is undergoing sanitization. It will automatically return to service after sterilization.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
