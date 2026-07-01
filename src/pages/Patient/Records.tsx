import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { 
  FileText, Calendar, User, FileSpreadsheet, Eye, 
  Printer, ArrowDownToLine, Star, Sparkles, X, Heart, Activity,
  ShoppingCart, CreditCard, Shield, CheckCircle2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Records: React.FC = () => {
  const { prescriptions, reports, activePatient } = useDemo();
  const [activeSection, setActiveSection] = useState<'prescriptions' | 'reports'>('prescriptions');
  
  // Modal viewer state
  const [viewingRx, setViewingRx] = useState<any | null>(null);
  const [viewingReport, setViewingReport] = useState<any | null>(null);

  // Pharmacy checkout states
  const [orderingRx, setOrderingRx] = useState<any | null>(null);
  const [orderStep, setOrderStep] = useState<'checkout' | 'success'>('checkout');
  const [isOrderingSubmitting, setIsOrderingSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');

  const userRxs = prescriptions.filter(p => p.patientId === activePatient.id);
  const userReports = reports.filter(r => r.patientId === activePatient.id);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Medical Records & Files</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Access clinical prescriptions, diagnostic reports, and physician consultation summaries.</p>
      </div>

      {/* Switch Buttons */}
      <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl max-w-sm">
        <button
          onClick={() => setActiveSection('prescriptions')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSection === 'prescriptions'
              ? 'bg-white dark:bg-slate-900 text-slate-805 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <FileText size={14} />
          <span>Prescriptions ({userRxs.length})</span>
        </button>
        <button
          onClick={() => setActiveSection('reports')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSection === 'reports'
              ? 'bg-white dark:bg-slate-900 text-slate-805 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <FileSpreadsheet size={14} />
          <span>Lab Reports ({userReports.length})</span>
        </button>
      </div>

      {/* Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {activeSection === 'prescriptions' ? (
          userRxs.length === 0 ? (
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl py-16 text-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
              No prescriptions found in your account.
            </div>
          ) : (
            userRxs.map((rx) => (
              <div 
                key={rx.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-base">{rx.doctorName}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{rx.date}</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full uppercase">
                      Rx ID: {rx.id.slice(-6)}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prescribed Medicines</span>
                    <div className="space-y-2">
                      {rx.medicines.map((med: any, index: number) => (
                        <div key={index} className="flex justify-between text-xs items-center bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                          <div className="text-left">
                            <span className="font-bold text-slate-800 dark:text-white">{med.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{med.instructions}</span>
                          </div>
                          <span className="bg-slate-205/80 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-650 dark:text-slate-300 text-[10px] whitespace-nowrap">
                            {med.dosage} • {med.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => setViewingRx(rx)}
                    className="flex-1 sm:flex-initial bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View File</span>
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          userReports.length === 0 ? (
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-205/60 dark:border-slate-800 rounded-3xl py-16 text-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
              No laboratory reports found.
            </div>
          ) : (
            userReports.map((rep) => (
              <div 
                key={rep.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-850 dark:text-white text-base">{rep.title}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">{rep.date} • {rep.category}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      rep.status === 'Normal'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-150 dark:border-emerald-900/50'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-150 dark:border-rose-900/50'
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed line-clamp-3 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850 text-left">
                    {rep.result}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => setViewingReport(rep)}
                    className="flex-1 sm:flex-initial bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>View Report</span>
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Prescription Detail Modal Viewer */}
      <AnimatePresence>
        {viewingRx && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingRx(null)}
              className="absolute inset-0 bg-slate-900"
            />
            
            <motion.div
              initial={{ opacity: 0, y: window.innerWidth < 640 ? '100%' : 20, scale: window.innerWidth < 640 ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: window.innerWidth < 640 ? '100%' : 20, scale: window.innerWidth < 640 ? 1 : 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[2rem] sm:rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[85vh] sm:max-h-[90vh] flex flex-col print:p-0 print:shadow-none"
            >
              <button 
                onClick={() => setViewingRx(null)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 print:hidden"
              >
                <X size={18} />
              </button>

              {/* Styled Letterhead Prescription */}
              <div className="flex-1 overflow-y-auto pr-2 print:overflow-visible text-left">
                {/* Doctor info */}
                <div className="flex justify-between items-start pb-6 border-b-2 border-slate-800">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">{viewingRx.doctorName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Certified General Medical Specialist</p>
                    <p className="text-[10px] text-slate-400">Apollo Premium Clinic • Edappally, Kochi</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white ml-auto">
                      <span className="font-black text-lg">D+</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mt-1">DOCTORSIN platform</span>
                  </div>
                </div>

                {/* Patient Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-450 block uppercase tracking-wider font-bold">Patient Name</span>
                    <span className="font-bold text-slate-800 dark:text-white">{activePatient.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-455 block uppercase tracking-wider font-bold">Age / Gender</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{activePatient.age} yrs / {activePatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-455 block uppercase tracking-wider font-bold">Date Issued</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{viewingRx.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-455 block uppercase tracking-wider font-bold">Rx Reference</span>
                    <span className="font-mono font-bold text-slate-805 dark:text-slate-400">{viewingRx.id.toUpperCase()}</span>
                  </div>
                </div>

                {/* Prescription Body */}
                <div className="py-6 space-y-6">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-450 font-black text-xl italic font-heading">
                    Rx
                  </div>

                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400/80 uppercase font-bold">
                        <th className="pb-3 w-1/2">Medicine Name & Instructions</th>
                        <th className="pb-3 text-center">Dosage</th>
                        <th className="pb-3 text-right">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                      {viewingRx.medicines.map((med: any, index: number) => (
                        <tr key={index}>
                          <td className="py-4">
                            <span className="font-extrabold text-slate-800 dark:text-white text-sm">{med.name}</span>
                            <span className="text-[10px] text-slate-450 dark:text-slate-400 block mt-0.5">{med.instructions}</span>
                          </td>
                          <td className="py-4 text-center">
                            <span className="bg-slate-105 dark:bg-slate-800 px-2.5 py-1 rounded font-bold text-slate-700 dark:text-slate-300">
                              {med.dosage}
                            </span>
                          </td>
                          <td className="py-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                            {med.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Notes & Doctor Sign */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid sm:grid-cols-2 gap-8 text-xs">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold">General Instructions</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{viewingRx.notes || 'No special notes'}"
                    </p>
                  </div>
                  <div className="text-right sm:ml-auto">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-bold mb-4">Doctor Signature</span>
                    <div className="h-10 flex items-center justify-end font-cursive text-lg text-blue-700 dark:text-blue-400 italic border-b border-slate-200 dark:border-slate-800 max-w-[150px] ml-auto">
                      {viewingRx.signature}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 block">Digitally Signed & Secured</span>
                  </div>
                </div>
              </div>

              {/* Print and Checkout buttons */}
              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 print:hidden">
                <button
                  onClick={() => { setViewingRx(null); setOrderingRx(viewingRx); setOrderStep('checkout'); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  <ShoppingCart size={14} />
                  <span>Order Medicines</span>
                </button>
                <button
                  onClick={() => setViewingRx(null)}
                  className="px-5 py-3 border border-slate-250 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-655 dark:text-slate-305"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Detail Modal Viewer */}
      <AnimatePresence>
        {viewingReport && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingReport(null)}
              className="absolute inset-0 bg-slate-900"
            />
            
            <motion.div
              initial={{ opacity: 0, y: window.innerWidth < 640 ? '100%' : 20, scale: window.innerWidth < 640 ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: window.innerWidth < 640 ? '100%' : 20, scale: window.innerWidth < 640 ? 1 : 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[2rem] sm:rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setViewingReport(null)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-650"
              >
                <X size={18} />
              </button>

              <div className="flex-1 overflow-y-auto pr-2 text-left">
                <div className="flex justify-between items-start pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-blue-600 bg-blue-55 dark:bg-blue-955 px-2 py-0.5 rounded-full uppercase">
                      {viewingReport.category}
                    </span>
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-white mt-1.5">{viewingReport.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kochi Diagnostic Laboratory Services</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-805 dark:text-white block">Report ID: {viewingReport.id}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Date Filed: {viewingReport.date}</span>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">Laboratory Observations & Summary</h4>
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl text-xs leading-relaxed text-slate-655 dark:text-slate-400 italic">
                    "{viewingReport.result}"
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Patient Parameters Check</h4>
                    <div className="space-y-3">
                      {[
                        { param: 'Oxyhemoglobin Saturation (SpO2)', val: '98%', status: 'Normal', ref: '95% - 100%' },
                        { param: 'Respiratory Rate (RR)', val: '16/min', status: 'Normal', ref: '12 - 20/min' },
                        { param: 'Forced Expiratory Volume (FEV1)', val: '3.2L', status: 'Normal', ref: '2.8L - 4.5L' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-3 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-colors">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white">{item.param}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Reference range: {item.ref}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-slate-850 dark:text-white block">{item.val}</span>
                            <span className="text-[9px] font-semibold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  onClick={() => setViewingReport(null)}
                  className="px-5 py-3 border border-slate-250 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-655 dark:text-slate-300"
                >
                  Close
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <Printer size={14} />
                  <span>Print Report</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pharmacy Checkout Modal */}
      <AnimatePresence>
        {orderingRx && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderingRx(null)}
              className="absolute inset-0 bg-slate-900"
            />
            
            <motion.div
              initial={{ opacity: 0, y: window.innerWidth < 640 ? '100%' : 20, scale: window.innerWidth < 640 ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: window.innerWidth < 640 ? '100%' : 20, scale: window.innerWidth < 640 ? 1 : 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-[2rem] sm:rounded-3xl shadow-2xl p-6 z-10 max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-y-auto"
            >
              <button 
                onClick={() => setOrderingRx(null)}
                className="absolute top-5 right-5 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400"
              >
                <X size={16} />
              </button>

              {orderStep === 'checkout' ? (
                <div className="text-left space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-xl">
                      <ShoppingCart size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">Pharmacy Fulfillment</h4>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">
                        Aster Pharmacy Edappally
                      </span>
                    </div>
                  </div>

                  {/* Medicines list */}
                  <div className="space-y-2 border-y border-slate-150 dark:border-slate-850 py-3 text-xs">
                    {orderingRx.medicines.map((med: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-808 dark:text-slate-250">{med.name}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{med.instructions}</span>
                        </div>
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-bold text-slate-600 dark:text-slate-300 text-[9px] whitespace-nowrap">
                          Qty: 1 box
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Invoice Summary */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Medicines total</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-305">₹380</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fast home delivery</span>
                      <span className="font-semibold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-bold text-slate-805 dark:text-white">
                      <span>Total to Pay</span>
                      <span>₹380</span>
                    </div>
                  </div>

                  {/* Address Summary */}
                  <div className="space-y-1.5 text-xs text-slate-655 dark:text-slate-350">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase">Delivery Location</span>
                    <p className="font-bold text-slate-808 dark:text-white">Hari Krishnan • Edappally, Kochi, Kerala</p>
                    <p className="text-[10px]">ETA: Within 2 Hours (Express delivery dispatch)</p>
                  </div>

                  {/* Razorpay UPI check */}
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                          paymentMethod === 'upi'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-650'
                            : 'border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        UPI (GPay, PhonePe)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-650'
                            : 'border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        Razorpay Checkout Card
                      </button>
                    </div>

                    {paymentMethod === 'upi' ? (
                      <input 
                        type="text" 
                        required
                        placeholder="Enter UPI ID (e.g. name@okaxis)" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500 font-mono dark:text-white"
                      />
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        <input 
                          type="text" 
                          placeholder="Card Number" 
                          defaultValue="4242 4242 4242 4242"
                          className="col-span-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-blue-500 font-mono dark:text-white"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setIsOrderingSubmitting(true);
                      setTimeout(() => {
                        setIsOrderingSubmitting(false);
                        setOrderStep('success');
                        confetti({
                          particleCount: 100,
                          spread: 60,
                          origin: { y: 0.85 }
                        });
                      }, 1000);
                    }}
                    disabled={isOrderingSubmitting}
                    className="w-full bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
                  >
                    {isOrderingSubmitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Securing Razorpay link...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={14} />
                        <span>Place Order (₹380)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 dark:border-emerald-900/50 shadow-inner">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-850 dark:text-white text-base">Order Placed Successfully!</h4>
                    <p className="text-xs text-slate-400 mt-1">Dispatched from Aster Pharmacy bypass store.</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 text-xs text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Delivery Partner</span>
                      <span className="font-bold text-slate-800 dark:text-white">Rajesh Kumar</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Order ID</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">ORD-{Date.now().toString().slice(-5)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">ETA</span>
                      <span className="font-bold text-emerald-600">45 Minutes</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setOrderingRx(null)}
                    className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
