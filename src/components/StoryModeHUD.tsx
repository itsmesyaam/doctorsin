import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import { Play, Sparkles, MonitorPlay, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StoryModeHUD: React.FC = () => {
  const navigate = useNavigate();
  const { changeRole, bookAppointment, addPrescription, verifyDoctor, approveHospital, doctors } = useDemo();
  const [activeTour, setActiveTour] = useState<string | null>(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Tour 1: Auto Booking Sequence
  const runBookingTour = () => {
    setActiveTour('Auto Booking Tour');
    changeRole('patient');
    navigate('/patient/find-doctor');

    // Step 1: Open booking modal for Dr. Haridas (doc-1) after 1.5s
    setTimeout(() => {
      // Save doctor to simulate select
      const doc = doctors.find(d => d.id === 'doc-1');
      if (doc) {
        localStorage.setItem('demo_preselected_doctor', 'doc-1');
        // Force state reload
        navigate('/patient/find-doctor');
      }
    }, 1200);

    // Step 2: Clear and return
    setTimeout(() => {
      setActiveTour(null);
      triggerConfetti();
    }, 4500);
  };

  // Tour 2: Join Telehealth Consultation
  const runCallTour = () => {
    setActiveTour('Telehealth Call Tour');
    changeRole('patient');
    // Pre-seed an active appointment to join
    localStorage.setItem('demo_active_telehealth_appt_id', 'appt-a4');
    navigate('/patient/telehealth');

    // Simulate chat sending
    setTimeout(() => {
      // Chat message is handled in component, we can let user inspect
      setActiveTour(null);
    }, 3000);
  };

  // Tour 3: Doctor EHR prescription compiler
  const runPrescriptionTour = () => {
    setActiveTour('Prescription Writer Tour');
    changeRole('doctor');
    localStorage.setItem('demo_doctor_consulting_appt_id', 'appt-a4');
    navigate('/doctor/consultation');

    setTimeout(() => {
      setActiveTour(null);
    }, 3000);
  };

  // Tour 4: Hospital Bed allocation
  const runBedsTour = () => {
    setActiveTour('Bed Roster Tour');
    changeRole('hospital');
    navigate('/hospital/beds');

    setTimeout(() => {
      setActiveTour(null);
    }, 3000);
  };

  // Tour 5: Super Admin Approvals
  const runApprovalsTour = () => {
    setActiveTour('Admin Verification Tour');
    changeRole('admin');
    navigate('/admin/approvals');

    setTimeout(() => {
      setActiveTour(null);
    }, 3000);
  };

  return (
    <div className="fixed top-20 inset-x-0 z-40 px-6 max-w-7xl mx-auto print:hidden pointer-events-none">
      <div className="bg-slate-900/90 border border-slate-800 text-white rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-4 pointer-events-auto backdrop-blur-md">
        
        {/* HUD label */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg text-white">
            <MonitorPlay size={15} />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Demo Assistant</span>
            <span className="text-xs font-black text-slate-100 block">
              {activeTour ? (
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Loader2 size={12} className="animate-spin" />
                  Running {activeTour}...
                </span>
              ) : 'Story Mode Macros'}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { name: '1-Click Booking', action: runBookingTour },
            { name: 'Join Call', action: runCallTour },
            { name: 'Prescription compiler', action: runPrescriptionTour },
            { name: 'Bed occupancy Map', action: runBedsTour },
            { name: 'License approvals', action: runApprovalsTour }
          ].map((tour) => (
            <button
              key={tour.name}
              onClick={tour.action}
              disabled={activeTour !== null}
              className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play size={10} fill="currentColor" />
              <span>{tour.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
