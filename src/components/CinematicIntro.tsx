import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [step, setStep] = useState(0); // 0: initial rays, 1: heartbeat line, 2: logo assembly, 3: glow fade

  // Play procedural healthcare synth sound using Web Audio API
  const playIntroSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Lub-Dub Heartbeat Beep
      const playHeartbeat = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.01, time);
        gain.gain.exponentialRampToValueAtTime(0.6, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.25);
        osc.start(time);
        osc.stop(time + 0.3);
      };

      // Sound 1: First Heartbeat (Lub)
      playHeartbeat(ctx.currentTime + 0.5, 75);
      // Sound 2: Second Heartbeat (Dub)
      playHeartbeat(ctx.currentTime + 0.7, 85);

      // Sound 3: Heavenly assembly glow sound (high chime)
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.frequency.setValueAtTime(220, ctx.currentTime + 1.2);
      chimeOsc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 2.5);
      chimeGain.gain.setValueAtTime(0.01, ctx.currentTime + 1.2);
      chimeGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1.8);
      chimeGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3.2);
      chimeOsc.start(ctx.currentTime + 1.2);
      chimeOsc.stop(ctx.currentTime + 3.5);

    } catch (e) {
      console.warn('Audio context blocked by browser user gesture policy:', e);
    }
  };

  useEffect(() => {
    // Stage 1: Play sound & animate heartbeat line
    const t1 = setTimeout(() => {
      setStep(1);
      playIntroSound();
    }, 600);

    // Stage 2: Logo assembly
    const t2 = setTimeout(() => {
      setStep(2);
    }, 1800);

    // Stage 3: Glowing final assembly
    const t3 = setTimeout(() => {
      setStep(3);
    }, 2800);

    // Stage 4: Trigger exit callback
    const t4 = setTimeout(() => {
      handleComplete();
    }, 3900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [soundEnabled]);

  const handleComplete = () => {
    localStorage.setItem('doctorsin_intro_played', 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#030712] flex flex-col items-center justify-center select-none overflow-hidden font-sans">
      
      {/* Sound Toggle (Top Right Corner) */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10 cursor-pointer"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button
          onClick={handleComplete}
          className="text-[10px] font-bold tracking-widest text-slate-500 hover:text-white uppercase transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-650 cursor-pointer"
        >
          Skip Intro
        </button>
      </div>

      {/* Cinematic Ray Lighting Backdrops */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[250px] w-[250px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute h-[500px] w-[500px] rounded-full bg-emerald-600/5 blur-[160px]" />
      </div>

      {/* Cinematic Particle Canvas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/20"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center space-y-6">
        
        {/* Heartbeat Line (Step 1) */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-[280px] h-[60px] flex items-center justify-center"
            >
              <svg viewBox="0 0 300 100" className="w-full h-full stroke-blue-500 fill-none stroke-[3]">
                <motion.path
                  d="M 0 50 L 80 50 L 100 20 L 120 80 L 140 30 L 150 50 L 300 50"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logo gradual assembly & Glow assembly (Step 2 & 3) */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="flex items-center gap-3">
                {/* Logo assembly icon */}
                <motion.div
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-2.5 flex items-center justify-center text-white shadow-xl shadow-blue-500/20"
                >
                  <Activity size={24} className="animate-pulse" />
                </motion.div>

                {/* Animated Brand text */}
                <div className="flex flex-col text-left">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 uppercase"
                  >
                    DOCTORSIN
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-[9px] font-bold tracking-[0.3em] text-blue-500 uppercase mt-0.5"
                  >
                    Kerala Healthcare Roster
                  </motion.span>
                </div>
              </div>

              {/* Assembly Light beams */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: [0, 1, 0], scaleX: [0, 1.2, 0] }}
                  transition={{ duration: 1 }}
                  className="w-[200px] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
