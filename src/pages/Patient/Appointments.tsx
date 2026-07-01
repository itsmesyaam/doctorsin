import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { 
  Calendar, Clock, Video, MapPin, XCircle, 
  CheckCircle, AlertCircle, FileText, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Appointments: React.FC = () => {
  const { appointments, activePatient, cancelAppointment } = useDemo();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const userAppts = appointments.filter(
    a => a.patientId === activePatient.id && a.status === activeTab
  );

  const handleCancelClick = (apptId: string) => {
    setCancellingId(apptId);
    setTimeout(() => {
      cancelAppointment(apptId);
      setCancellingId(null);
    }, 600);
  };

  const handleJoinCall = (apptId: string) => {
    localStorage.setItem('demo_active_telehealth_appt_id', apptId);
    navigate('/patient/telehealth');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'upcoming':
        return <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Upcoming</span>;
      case 'completed':
        return <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-605 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Completed</span>;
      case 'cancelled':
        return <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Appointment Roster</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review upcoming consultations, past logs, or reschedule appointments.</p>
        </div>
        <button
          onClick={() => navigate('/patient/find-doctor')}
          className="bg-blue-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10 cursor-pointer shrink-0"
        >
          Book Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold capitalize transition-all relative cursor-pointer ${
              activeTab === tab
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>{tab}</span>
            {activeTab === tab && (
              <motion.div
                layoutId="appt-active-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {userAppts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl py-16 text-center text-slate-500 dark:text-slate-400 text-sm font-semibold">
            No {activeTab} appointments found.
          </div>
        ) : (
          <div className="space-y-4">
            {userAppts.map((appt) => (
              <div 
                key={appt.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-6"
              >
                {/* Appointment Info */}
                <div className="flex items-start gap-4 text-left">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-800 dark:text-white text-base">{appt.doctorName}</h4>
                      {getStatusBadge(appt.status)}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-550 font-semibold mt-0.5">{appt.doctorSpecialty} • {appt.hospitalName}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-550 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {appt.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {appt.timeSlot}</span>
                      <span className="flex items-center gap-1.5">
                        {appt.type === 'video' ? (
                          <><Video size={14} className="text-blue-550" /> <span className="font-bold text-blue-600 dark:text-blue-400">Video Call</span></>
                        ) : (
                          <><MapPin size={14} className="text-slate-400" /> <span>Clinic Visit</span></>
                        )}
                      </span>
                    </div>

                    {appt.reason && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 italic leading-relaxed">
                        Reason: "{appt.reason}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 justify-end">
                  {appt.status === 'upcoming' && (
                    <>
                      <button
                        onClick={() => handleCancelClick(appt.id)}
                        disabled={cancellingId === appt.id}
                        className="border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-605 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {cancellingId === appt.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                      
                      {appt.type === 'video' && (
                        <button
                          onClick={() => handleJoinCall(appt.id)}
                          className="bg-blue-650 text-white hover:bg-blue-750 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Video size={14} />
                          <span>Join Call</span>
                        </button>
                      )}
                    </>
                  )}

                  {appt.status === 'completed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate('/patient/records')}
                        className="bg-blue-50 dark:bg-blue-950/40 text-blue-605 dark:text-blue-400 hover:bg-blue-100/50 px-4.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText size={14} />
                        <span>Medical Files</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
