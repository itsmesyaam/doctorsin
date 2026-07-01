import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { 
  Video, VideoOff, Mic, MicOff, ScreenShare, PhoneOff, 
  AlertCircle, FileText, Plus, Trash2, CheckCircle2, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MedicalAvatar } from '../../components/MedicalAvatar';

interface FormMedicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export const Consultation: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, addPrescription } = useDemo();
  const [apptId, setApptId] = useState<string | null>(null);

  // Form states
  const [medicines, setMedicines] = useState<FormMedicine[]>([
    { name: '', dosage: '1-0-1', duration: '5 days', instructions: 'After food' }
  ]);
  const [rxNotes, setRxNotes] = useState('');
  
  // Call hardware controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);
  const [isConsultationFinished, setIsConsultationFinished] = useState(false);

  // Call timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Pull active consulting appointment
  useEffect(() => {
    const id = localStorage.getItem('demo_doctor_consulting_appt_id');
    if (id) {
      setApptId(id);
    } else {
      const upcoming = appointments.find(a => a.status === 'upcoming');
      if (upcoming) {
        setApptId(upcoming.id);
      }
    }
  }, [appointments]);

  const appt = appointments.find(a => a.id === apptId);

  // Timer effect
  useEffect(() => {
    if (!isCallActive) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAddMedicineRow = () => {
    setMedicines(prev => [...prev, { name: '', dosage: '1-0-1', duration: '5 days', instructions: 'After food' }]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    if (medicines.length === 1) return;
    setMedicines(prev => prev.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof FormMedicine, value: string) => {
    setMedicines(prev => prev.map((med, i) => {
      if (i === index) {
        return { ...med, [field]: value };
      }
      return med;
    }));
  };

  const handleSubmitPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptId || medicines.some(m => !m.name.trim())) return;

    addPrescription(apptId, medicines, rxNotes);

    setIsCallActive(false);
    setIsConsultationFinished(true);
    localStorage.removeItem('demo_doctor_consulting_appt_id');
  };

  if (!appt) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 max-w-xl mx-auto space-y-4 my-10 text-left shadow-sm">
        <AlertCircle size={40} className="mx-auto text-slate-400" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Patient in Queue</h3>
        <p className="text-xs text-slate-450 leading-relaxed dark:text-slate-400">
          There are no patients currently awaiting consultation in the room. Go back to today's dashboard queue list to start a consult.
        </p>
        <button 
          onClick={() => navigate('/doctor')}
          className="bg-blue-650 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors mx-auto block cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-6 text-left">
      {/* Left Column: Patient Video Feed */}
      <div className="flex-1 bg-slate-900 dark:bg-slate-950 rounded-3xl overflow-hidden relative flex flex-col justify-between p-6 text-white min-h-[350px]">
        {/* Top bar info */}
        <div className="flex items-center justify-between z-10">
          <span className="bg-red-500/80 border border-red-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>Consultation Active</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="bg-slate-850/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5">
              <Clock size={12} className="text-blue-400" />
              {formatTimer(secondsElapsed)}
            </span>
            <span className="bg-slate-850/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold">
              Patient: {appt.patientName} (Age 29, Male)
            </span>
          </div>
        </div>

        {/* Video feed */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCallActive ? (
            isVideoOn ? (
              <div className="relative w-full h-full bg-slate-800 flex flex-col items-center justify-center gap-3">
                <MedicalAvatar name={appt.patientName} type="patient" size={20} />
                <span className="text-xs text-slate-400 font-semibold animate-pulse">Connecting...</span>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/40 pointer-events-none" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <VideoOff size={48} />
                <span className="text-xs font-semibold">Patient camera is off</span>
              </div>
            )
          ) : isConsultationFinished ? (
            <div className="text-center space-y-4 max-w-sm px-6">
              <div className="h-12 w-12 bg-emerald-500/20 text-emerald-450 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-lg font-bold">Consultation Finalized!</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The prescription record has been successfully compiled and signed. Alexander Fleming has been notified and sent details.
              </p>
              <button 
                onClick={() => navigate('/doctor')}
                className="bg-white text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors mx-auto block cursor-pointer border border-slate-700"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <PhoneOff size={48} className="text-rose-500 mx-auto" />
              <h4 className="text-lg font-bold">Call Ended</h4>
            </div>
          )}

          {/* Doctor preview */}
          {isCallActive && (
            <div className="absolute bottom-20 right-4 h-28 sm:h-36 aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl z-20 flex items-center justify-center">
              <MedicalAvatar name="You" type="doctor" size={12} />
            </div>
          )}
        </div>

        {/* Action Controls */}
        {isCallActive && (
          <div className="flex justify-center items-center gap-4 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-2xl w-fit mx-auto border border-slate-800 z-10 shadow-2xl">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button 
              onClick={() => setIsCallActive(false)}
              className="p-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Prescription Form */}
      <div className="w-full lg:w-[480px] bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-805 rounded-3xl flex flex-col justify-between overflow-hidden shadow-sm shrink-0 h-full">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-955 border-b border-slate-200 dark:border-slate-805 p-4 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <h4 className="font-bold text-slate-850 dark:text-white text-sm">Prescription Form (Rx)</h4>
          </div>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">EHR Sync</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitPrescription} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Prescribed Drugs</span>
                <button
                  type="button"
                  onClick={handleAddMedicineRow}
                  disabled={!isCallActive}
                  className="text-xs text-blue-650 dark:text-blue-400 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>Add Medicine</span>
                </button>
              </div>

              <div className="space-y-4">
                {medicines.map((med, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-3 relative group">
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(index)}
                        disabled={!isCallActive}
                        className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-3 pr-6 text-left">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Medicine Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Paracetamol, Salbutamol"
                          value={med.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                          disabled={!isCallActive}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 font-semibold text-slate-800 dark:text-white disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Dosage</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 1-0-1, 0-0-1"
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                          disabled={!isCallActive}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Duration</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. 5 days, 1 month"
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                          disabled={!isCallActive}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Instructions</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Post meals, take before sleep"
                          value={med.instructions}
                          onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                          disabled={!isCallActive}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-blue-500 font-medium text-slate-700 dark:text-slate-200 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-left pt-2">
              <label className="text-[10px] font-bold text-slate-450 uppercase">Clinical Advice / Notes</label>
              <textarea
                rows={3}
                placeholder="Avoid cold beverages. Rest for next 3 days..."
                value={rxNotes}
                onChange={(e) => setRxNotes(e.target.value)}
                disabled={!isCallActive}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-xs outline-none focus:border-blue-500 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
            <button
              type="submit"
              disabled={!isCallActive || medicines.some(m => !m.name.trim())}
              className="w-full bg-blue-650 hover:bg-blue-755 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <CheckCircle2 size={16} />
              <span>Complete Consult & Sign Rx</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
