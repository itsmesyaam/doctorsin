import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * DOCTORSIN Brand Logo Component
 * 
 * Original design: A stylized "D" letterform with an integrated heartbeat/pulse line.
 * The pulse line cuts through the center of the D, symbolizing digital healthcare.
 * 
 * Variants:
 * - full: Icon + DOCTORSIN + tagline (vertical)
 * - icon: Just the icon mark
 * - horizontal: Icon + DOCTORSIN (side by side)
 */
export const DoctorsInLogo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  theme = 'dark',
  size = 'md',
  className = '',
}) => {
  const isDark = theme === 'dark';

  // Size configuration
  const sizeConfig = {
    sm: { icon: 24, text: 'text-sm', tagline: 'text-[7px]', gap: 'gap-1.5' },
    md: { icon: 32, text: 'text-lg', tagline: 'text-[8px]', gap: 'gap-2' },
    lg: { icon: 48, text: 'text-2xl', tagline: 'text-[10px]', gap: 'gap-3' },
  };

  const config = sizeConfig[size];

  // The SVG icon mark — a "D" with heartbeat pulse
  const IconMark = () => (
    <svg
      width={config.icon}
      height={config.icon}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={`logo-grad-${size}`} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#logo-grad-${size})`} />
      {/* Stylized "D" outline */}
      <path
        d="M8 16 C8 10.5 12.5 7 17 7 C21.5 7 25 10.5 25 16 C25 21.5 21.5 25 17 25 L8 25 L8 16Z"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Heartbeat pulse line through center */}
      <path
        d="M11 16 L13.5 16 L14.5 12 L16 20 L17.5 14 L18.5 16 L21 16"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Brand wordmark
  const Wordmark = () => (
    <span
      className={`font-black ${config.text} tracking-[0.15em] uppercase ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      DOCTORSIN
    </span>
  );

  // Tagline
  const Tagline = () => (
    <span
      className={`${config.tagline} font-bold tracking-[0.25em] uppercase ${
        isDark ? 'text-blue-400' : 'text-blue-600'
      }`}
    >
      Healthcare. Connected.
    </span>
  );

  if (variant === 'icon') {
    return (
      <div className={className}>
        <IconMark />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center ${config.gap} ${className}`}>
        <IconMark />
        <div className="flex flex-col items-center">
          <Wordmark />
          <Tagline />
        </div>
      </div>
    );
  }

  // horizontal (default)
  return (
    <div className={`flex items-center ${config.gap} ${className}`}>
      <IconMark />
      <div className="flex flex-col">
        <Wordmark />
        {size !== 'sm' && <Tagline />}
      </div>
    </div>
  );
};
