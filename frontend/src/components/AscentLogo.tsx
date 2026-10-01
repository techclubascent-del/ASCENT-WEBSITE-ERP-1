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
        <img
          src="/assets/ascent-logo-exact.svg"
          alt="ASCENT Emblem"
          className="w-full h-full object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
        />
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
        </div>
      )}
    </div>
  );
};

export default AscentLogo;
