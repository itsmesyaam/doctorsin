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
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Revenue & Payout Roster</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review gross payouts, transaction logs, commission splits, and bank deposits.</p>
      </div>

      {/* Revenue Grid Widgets */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Gross Payout</span>
          <span className="text-xl font-black text-slate-800 dark:text-white block mt-1">${totalRev.toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Commission Split (15%)</span>
          <span className="text-xl font-black text-slate-800 dark:text-white block mt-1">${(totalRev * 0.15).toLocaleString()}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Net Bank Deposits</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">${(totalRev * 0.85).toLocaleString()}</span>
        </div>
      </div>

      {/* Transactions list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Recent Consultation Bills</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Billing Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-medium">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                  <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-350">{t.id}</td>
                  <td className="p-4 font-bold text-slate-800 dark:text-white">{t.patient}</td>
                  <td className="p-4 text-slate-655 dark:text-slate-300 font-semibold">{t.dept}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{t.date}</td>
                  <td className="p-4 font-black text-slate-800 dark:text-white">${t.amount}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-455 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-150 dark:border-emerald-900/50">
                      {t.status}
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
