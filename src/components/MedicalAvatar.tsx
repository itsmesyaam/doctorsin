import React from 'react';
import { Stethoscope, User, Building2, Heart, Activity, ShieldCheck } from 'lucide-react';

interface MedicalAvatarProps {
  name: string;
  type: 'doctor' | 'patient' | 'hospital';
  specialty?: string;
  size?: number; // Tailwind class size number mapping (e.g., 8, 10, 12, 16, 20, 24)
}

export const MedicalAvatar: React.FC<MedicalAvatarProps> = ({
  name,
  type,
  specialty = 'General',
  size = 12
}) => {
  // Extract initials (e.g. "Dr. Haridas Menon" -> "HM", "Hari Krishnan" -> "HK")
  const getInitials = (fullName: string) => {
    let clean = fullName.replace(/Dr\.\s+/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  // Gradient palettes matching eHealth theme
  const getGradient = () => {
    if (type === 'hospital') {
      return 'from-indigo-600 to-violet-500 text-white';
    }
    if (type === 'patient') {
      return 'from-sky-500 to-blue-600 text-white';
    }

    // Doctor specialty gradients
    const spec = specialty.toLowerCase();
    if (spec.includes('cardio')) {
      return 'from-rose-500 to-red-600 text-white';
    }
    if (spec.includes('derm')) {
      return 'from-amber-500 to-orange-600 text-white';
    }
    if (spec.includes('paed') || spec.includes('ped')) {
      return 'from-pink-500 to-purple-600 text-white';
    }
    if (spec.includes('ortho')) {
      return 'from-slate-600 to-indigo-700 text-white';
    }
    if (spec.includes('neuro')) {
      return 'from-violet-600 to-purple-700 text-white';
    }
    if (spec.includes('general') || spec.includes('med')) {
      return 'from-emerald-500 to-teal-600 text-white';
    }
    if (spec.includes('gyn')) {
      return 'from-fuchsia-500 to-rose-600 text-white';
    }
    
    // Fallback
    return 'from-blue-500 to-indigo-600 text-white';
  };

  const gradient = getGradient();

  // Dimension styling mapping
  const sizeClasses: { [key: number]: string } = {
    8: 'h-8 w-8 text-[10px]',
    10: 'h-10 w-10 text-xs',
    12: 'h-12 w-12 text-sm',
    14: 'h-14 w-14 text-sm',
    16: 'h-16 w-16 text-base',
    20: 'h-20 w-20 text-lg',
    24: 'h-24 w-24 text-xl',
    32: 'h-32 w-32 text-2xl'
  };

  const finalSizeClass = sizeClasses[size] || 'h-12 w-12 text-sm';

  return (
    <div className={`relative flex-shrink-0 select-none ${finalSizeClass}`}>
      <div className={`h-full w-full rounded-2xl bg-gradient-to-tr ${gradient} flex flex-col items-center justify-center font-bold tracking-wider shadow-md border border-white/10 relative overflow-hidden`}>
        {/* Subtle radial sheen layer */}
        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
        
        {/* Initials */}
        <span className="z-10">{initials}</span>

        {/* Small badge icon inside the corner representing category */}
        <div className="absolute bottom-1 right-1 opacity-20">
          {type === 'hospital' && <Building2 size={12} />}
          {type === 'patient' && <User size={12} />}
          {type === 'doctor' && <Stethoscope size={12} />}
        </div>
      </div>
    </div>
  );
};
