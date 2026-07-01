import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { ShieldCheck, Percent, DollarSign, Activity, CheckCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { commissionRate, telehealthFee, updateSettings } = useDemo();
  const [commRateInput, setCommRateInput] = useState(commissionRate);
  const [feeInput, setFeeInput] = useState(telehealthFee);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(commRateInput, feeInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8 text-left max-w-3xl">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Platform Global Variables</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Configure transaction commission rate margins, default booking fees, and diagnostic features.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">Financial Variables</h3>
          
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Commission slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Percent size={14} className="text-slate-400" />
                  <span>Platform Commission Cut</span>
                </label>
                <span className="font-extrabold text-blue-650 dark:text-blue-400 text-sm">{commRateInput}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="1" 
                value={commRateInput}
                onChange={(e) => setCommRateInput(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-550 leading-relaxed block">
                Percentage slice taken from gross physician booking fees for platform maintenance.
              </span>
            </div>

            {/* Base Telehealth Service Fee */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-slate-400" />
                  <span>Base Telehealth Conveniency Fee</span>
                </label>
                <span className="font-extrabold text-blue-650 dark:text-blue-400 text-sm">₹{feeInput}</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="50" 
                step="5" 
                value={feeInput}
                onChange={(e) => setFeeInput(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-550 leading-relaxed block">
                Convenience fee charged per online video call setup.
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {isSaved ? (
              <span className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle size={16} />
                <span>System configuration updated</span>
              </span>
            ) : <span />}
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer animate-fade-in"
            >
              Apply Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
