import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface AscentLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  variant?: 'monochrome' | 'accent' | 'silver';
  accentColor?: string;
}

/**
 * ASCENT Brand Logo
 * Matches Screenshot (166).png and Screenshot (165).png
 * Features the signature aerodynamic triangle apex emblem with the orbital focal node
 * and tracked geometric typography.
 */
export const AscentLogo: React.FC<AscentLogoProps> = ({
  className = '',
  size = 32,
  showWordmark = true,
  wordmarkClassName = '',
  variant = 'monochrome',
  accentColor = '#004AAD',
}) => {
  let isLight = false;
  try {
    const { theme } = useTheme();
    isLight = theme === 'light';
  } catch {
    isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');
  }

  const iconColor =
    variant === 'accent'
      ? accentColor
      : variant === 'silver'
      ? isLight
        ? '#545454'
        : '#A6A6A6'
      : isLight
      ? '#1E1E1E'
      : '#FFFFFF';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} id="ascent-brand-logo">
      {/* Icon Glyph */}
      <div 
        className="relative flex items-center justify-center transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
        >
          {/* Main Triangle / Apex Outer Silhouette */}
          <path
            d="M 50 12 L 84 82 L 67 82 L 50 48 L 33 82 L 16 82 Z"
            fill={iconColor}
          />
          {/* Internal Aerodynamic Swoop Arc */}
          <path
            d="M 50 48 C 50 48 59 62 55 76 C 53 82 48 83 45 81 C 41 78 44 71 47 67 C 50 63 53 58 50 48 Z"
            fill={variant === 'accent' ? accentColor : '#D4A373'}
            opacity="0.95"
          />
          {/* Orbital Ascent Node / Dot with Touch of Ochre Gold (#D4A373) */}
          <circle
            cx="50"
            cy="76"
            r="4.2"
            fill={variant === 'accent' ? '#D4A373' : isLight ? '#1E1E1E' : '#D4A373'}
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-heading tracking-[0.28em] uppercase text-[#1E1E1E] dark:text-white font-normal leading-none ${
              wordmarkClassName || 'text-sm md:text-base'
            }`}
          >
            ASCENT
          </span>
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-[#545454] dark:text-[#A6A6A6] mt-0.5">
            Public Platform
          </span>
        </div>
      )}
    </div>
  );
};

export default AscentLogo;
