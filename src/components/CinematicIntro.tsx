import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { DoctorsInLogo } from './DoctorsInLogo';

interface CinematicIntroProps {
  onComplete: () => void;
}

/**
 * DOCTORSIN Premium Loading Screen & Cinematic Intro
 * Total duration: ~4.0 seconds.
 * 
 * Flow:
 * 1. 0s–1.2s: Loading & Splash Screen (animated logo, ECG pulse, progress bar 0->100%)
 * 2. 1.2s–2.3s: Heartbeat SVG draws itself + lub-dub sound
 * 3. 2.3s–3.4s: Logo & Tagline Assembly + chime sound
 * 4. 3.4s–4.0s: Light sweep, fade out, complete
 */
export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stage, setStage] = useState<'loading' | 'heartbeat' | 'assembly' | 'sweep' | 'done'>('loading');
  const [progress, setProgress] = useState(0);

  const handleComplete = useCallback(() => {
    localStorage.setItem('doctorsin_intro_played', 'true');
    onComplete();
  }, [onComplete]);

  // Procedural Web Audio API sound generator
  const playSound = useCallback((type: 'beep' | 'lub-dub' | 'chime') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === 'beep') {
        // Initial loading radar beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'lub-dub') {
        // Heartbeat thumps
        const playThump = (time: number, freq: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.01, time);
          gain.gain.exponentialRampToValueAtTime(0.6, time + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.3);
        };
        playThump(now, 72);
        playThump(now + 0.2, 88);
      } else if (type === 'chime') {
        // Heavenly chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 1.2);
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.3);
      }
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }, [soundEnabled]);

  useEffect(() => {
    // Stage 1: Loading Screen (0s to 1.2s)
    playSound('beep');
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + 4;
      });
    }, 40);

    const tHeartbeat = setTimeout(() => {
      setStage('heartbeat');
      playSound('lub-dub');
    }, 1200);

    const tAssembly = setTimeout(() => {
      setStage('assembly');
      playSound('chime');
    }, 2300);

    const tSweep = setTimeout(() => {
      setStage('sweep');
    }, 3400);

    const tDone = setTimeout(() => {
      handleComplete();
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(tHeartbeat);
      clearTimeout(tAssembly);
      clearTimeout(tSweep);
      clearTimeout(tDone);
    };
  }, [playSound, handleComplete]);

  // Floating ambient particles
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        w: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        dur: Math.random() * 4 + 3,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="fixed inset-0 z-[9999] bg-[#030712] flex flex-col items-center justify-center select-none overflow-hidden font-sans">
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

      {/* ── Ambient Glowing Backdrops ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[130px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-teal-600/5 blur-[160px]" />
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
            animate={{ y: [0, -100], opacity: [0, 0.6, 0] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Content Router based on stage ── */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-sm px-6">
        
        <AnimatePresence mode="wait">
          {stage === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-6 w-full text-center"
            >
              {/* Animated logo mark in center */}
              <div className="relative p-4 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-xl shadow-blue-500/5">
                <DoctorsInLogo variant="icon" size="lg" theme="dark" className="animate-pulse" />
              </div>

              {/* Progress bar and statistics */}
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                  <span>Smart Suite Initializing</span>
                  <span className="font-mono text-blue-400">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Connected ECG live feed vector simulator */}
              <div className="w-full h-8 opacity-40">
                <svg viewBox="0 0 200 40" className="w-full h-full stroke-teal-500 fill-none stroke-2">
                  <path d="M 0 20 L 40 20 L 50 20 L 55 10 L 60 30 L 65 5 L 70 35 L 75 20 L 80 20 L 120 20 L 130 20 L 135 10 L 140 30 L 145 5 L 150 35 L 155 20 L 200 20" />
                </svg>
              </div>
            </motion.div>
          )}

          {stage === 'heartbeat' && (
            <motion.div
              key="heartbeat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[280px] h-[60px] flex items-center justify-center"
            >
              {/* Glowing vector heartbeat line drawing */}
              <svg viewBox="0 0 300 100" className="w-full h-full fill-none">
                <defs>
                  <linearGradient id="intro-pulse-grad" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 0 50 L 80 50 L 100 20 L 120 80 L 140 30 L 150 50 L 300 50"
                  stroke="url(#intro-pulse-grad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, ease: 'easeInOut' }}
                />
              </svg>
            </motion.div>
          )}

          {stage === 'assembly' && (
            <motion.div
              key="assembly"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-5"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <DoctorsInLogo variant="icon" size="lg" theme="dark" />
                </motion.div>

                <div className="flex flex-col text-left">
                  <motion.span
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="font-black text-2xl tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 uppercase"
                  >
                    DOCTORSIN
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-[9px] font-bold tracking-[0.3em] text-blue-400 uppercase mt-0.5"
                  >
                    Healthcare. Connected.
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'sweep' && (
            <motion.div
              key="sweep"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeIn' }}
              className="flex flex-col items-center space-y-5"
            >
              <div className="flex items-center gap-3">
                <DoctorsInLogo variant="icon" size="lg" theme="dark" />
                <div className="flex flex-col text-left">
                  <span className="font-black text-2xl tracking-[0.15em] text-white uppercase">DOCTORSIN</span>
                  <span className="text-[9px] font-bold tracking-[0.3em] text-blue-400 uppercase mt-0.5">Healthcare. Connected.</span>
                </div>
              </div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1.2, opacity: [0, 1, 0] }}
                transition={{ duration: 0.5 }}
                className="w-[200px] h-[1px] bg-gradient-to-r from-transparent via-teal-500 to-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
