import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { CreditCard, Calendar, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

export const Revenue: React.FC = () => {
  const { activeHospital } = useDemo();

  const totalRev = activeHospital.revenue.reduce((sum, val) => sum + val, 0);

  // Mock transactions list
  const transactions = [
    { id: 'TXN-90234', patient: 'Alexander Fleming', dept: 'Cardiology', date: '2026-07-01', amount: 800, status: 'Settled' },
    { id: 'TXN-90235', patient: 'Sarah Jenkins', dept: 'Dermatology', date: '2026-07-01', amount: 600, status: 'Settled' },
    { id: 'TXN-90236', patient: 'Arthur Dent', dept: 'Pediatrics', date: '2026-06-30', amount: 500, status: 'Settled' },
    { id: 'TXN-90237', patient: 'Ford Prefect', dept: 'Neurology', date: '2026-06-29', amount: 1000, status: 'Settled' },
    { id: 'TXN-90238', patient: 'Tricia McMillan', dept: 'Cardiology', date: '2026-06-28', amount: 800, status: 'Settled' }
  ];

  return (
    <div className="space-y-6 text-left pb-20 select-none">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Revenue & Billing Ledger</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review gross payouts, commission splits, and bank deposits.</p>
      </div>

      {/* Revenue Grid Widgets */}
      <div className="space-y-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-400 font-bold block uppercase">Total Gross Payout</span>
          <span className="text-lg font-black text-slate-800 dark:text-white mt-1">${totalRev.toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-400 font-bold block uppercase">Commission Split (15%)</span>
          <span className="text-lg font-black text-slate-800 dark:text-white mt-1">${(totalRev * 0.15).toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
          <span className="text-[9px] text-slate-400 font-bold block uppercase">Net Bank Deposits</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">${(totalRev * 0.85).toLocaleString()}</span>
        </div>
      </div>

      {/* Billing cards (No Tables on mobile) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider">Recent Consultation Bills</h3>
        </div>

        <div className="space-y-3">
          {transactions.map((t) => (
            <div 
              key={t.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex flex-col justify-between gap-3 text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-slate-400 font-mono block">{t.id}</span>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">{t.patient}</h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{t.dept} Department</span>
                </div>
                
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold border border-emerald-150 dark:border-emerald-900/50">
                  {t.status}
                </span>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-xs">
                <span className="text-[10px] text-slate-400 font-mono">{t.date}</span>
                <span className="font-black text-slate-808 dark:text-white text-sm">${t.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
