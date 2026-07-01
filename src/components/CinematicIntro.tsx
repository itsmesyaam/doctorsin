import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { DoctorsInLogo } from './DoctorsInLogo';

interface CinematicIntroProps {
  onComplete: () => void;
}

/**
 * DOCTORSIN Cinematic Brand Reveal
 *
 * A premium 5-scene healthcare-inspired cinematic intro sequence.
 *
 * Scene 1 (0–600ms):   Dark ambient — particles + glow orbs
 * Scene 2 (600–1800ms): Heartbeat SVG line draws itself + procedural audio
 * Scene 3 (1800–2800ms): Logo icon springs in, brand text slides in
 * Scene 4 (2800–3400ms): Horizontal light beam sweep
 * Scene 5 (3400–3900ms): Fade out, transition to app
 *
 * Plays once per browser session (localStorage gated).
 * Procedural audio via Web Audio API (no copyrighted sounds).
 */
export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [step, setStep] = useState(0);

  const handleComplete = useCallback(() => {
    localStorage.setItem('doctorsin_intro_played', 'true');
    onComplete();
  }, [onComplete]);

  // Procedural healthcare audio using Web Audio API
  const playIntroSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Helper: play a single heartbeat thump
      const playBeat = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.exponentialRampToValueAtTime(0.5, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        osc.start(time);
        osc.stop(time + 0.3);
      };

      // Lub-Dub heartbeat
      const now = ctx.currentTime;
      playBeat(now + 0.4, 72);
      playBeat(now + 0.6, 88);

      // Ascending digital chime (assembly sound)
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.frequency.setValueAtTime(220, now + 1.2);
      chime.frequency.exponentialRampToValueAtTime(660, now + 2.5);
      chimeGain.gain.setValueAtTime(0.01, now + 1.2);
      chimeGain.gain.linearRampToValueAtTime(0.25, now + 1.8);
      chimeGain.gain.exponentialRampToValueAtTime(0.01, now + 3.2);
      chime.start(now + 1.2);
      chime.stop(now + 3.5);

      // Soft ambient pad
      const pad = ctx.createOscillator();
      const padGain = ctx.createGain();
      pad.type = 'triangle';
      pad.connect(padGain);
      padGain.connect(ctx.destination);
      pad.frequency.setValueAtTime(110, now + 0.2);
      padGain.gain.setValueAtTime(0.01, now + 0.2);
      padGain.gain.linearRampToValueAtTime(0.08, now + 1.0);
      padGain.gain.linearRampToValueAtTime(0.01, now + 3.8);
      pad.start(now + 0.2);
      pad.stop(now + 4.0);
    } catch (e) {
      console.warn('Audio context unavailable:', e);
    }
  }, [soundEnabled]);

  useEffect(() => {
    // Scene progression
    const t1 = setTimeout(() => {
      setStep(1);
      playIntroSound();
    }, 600);

    const t2 = setTimeout(() => setStep(2), 1800);
    const t3 = setTimeout(() => setStep(3), 2800);
    const t4 = setTimeout(() => handleComplete(), 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [playIntroSound, handleComplete]);

  // Particle data (memoized once)
  const particles = React.useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        w: Math.random() * 3 + 1.5,
        left: Math.random() * 100,
        top: Math.random() * 100,
        dur: Math.random() * 4 + 3,
        delay: Math.random() * 3,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-[#030712] flex flex-col items-center justify-center select-none overflow-hidden">
      {/* ── Controls (top-right) ── */}
      <div className="absolute top-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled((s) => !s)}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/10 cursor-pointer"
          aria-label="Toggle sound"
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>
        <button
          onClick={handleComplete}
          className="text-[10px] font-bold tracking-widest text-slate-600 hover:text-white uppercase transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-600 cursor-pointer"
        >
          Skip Intro
        </button>
      </div>

      {/* ── Scene 1: Ambient backdrop ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary blue glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[280px] w-[280px] rounded-full bg-blue-600/10 blur-[140px] animate-pulse" />
        {/* Secondary teal glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-teal-600/5 blur-[180px]" />
      </div>

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-blue-400/20"
            style={{
              width: p.w,
              height: p.w,
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{ y: [0, -120], opacity: [0, 0.7, 0] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Main content area ── */}
      <div className="relative flex flex-col items-center justify-center space-y-6">
        {/* Scene 2: Heartbeat line */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="w-[280px] h-[60px] flex items-center justify-center"
            >
              <svg
                viewBox="0 0 300 100"
                className="w-full h-full fill-none"
              >
                <defs>
                  <linearGradient id="pulse-grad" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 0 50 L 80 50 L 100 20 L 120 80 L 140 30 L 150 50 L 300 50"
                  stroke="url(#pulse-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene 3: Logo assembly */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="flex flex-col items-center space-y-5"
            >
              <div className="flex items-center gap-3">
                {/* Icon springs in */}
                <motion.div
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 14 }}
                >
                  <DoctorsInLogo variant="icon" size="lg" theme="dark" />
                </motion.div>

                {/* Brand text */}
                <div className="flex flex-col text-left">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="font-black text-2xl tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 uppercase"
                  >
                    DOCTORSIN
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="text-[9px] font-bold tracking-[0.3em] text-blue-400 uppercase mt-0.5"
                  >
                    Healthcare. Connected.
                  </motion.span>
                </div>
              </div>

              {/* Scene 4: Light beam sweep */}
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: [0, 1, 0], scaleX: [0, 1.2, 0] }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  className="w-[220px] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
