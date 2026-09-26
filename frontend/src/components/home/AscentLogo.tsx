"use client";

interface AscentLogoProps {
  size?: 'sm' | 'md' | 'lg' | number;
  showMotto?: boolean;
  showWordmark?: boolean;
  variant?: 'default' | 'monochrome';
  className?: string;
}

export function AscentLogo({ size = 'md', showMotto = false, showWordmark = true, variant = 'default', className = '' }: AscentLogoProps) {
  const iconSizes: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes: Record<string, string> = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const isNumericSize = typeof size === 'number';
  const iconStyle = isNumericSize ? { width: size, height: size } : {};
  const iconClassName = !isNumericSize ? iconSizes[size as string] || 'w-10 h-10' : '';
  const textSizeClassName = !isNumericSize ? textSizes[size as string] || 'text-xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Geometric Logo Icon */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#D4A373]/20 to-[#FAEDCD]/10 border border-[#D4A373]/30 shadow-[0_0_15px_rgba(212,163,115,0.15)] group transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,163,115,0.3)] hover:border-[#D4A373]/60 ${iconClassName}`}
        style={iconStyle}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 transform group-hover:scale-110 transition-transform duration-500"
        >
          {/* Futuristic 'A' / Mountain Shape */}
          <path
            d="M12 3L20 21H16L12 12L8 21H4L12 3Z"
            fill="url(#ascent-gradient)"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          />
          <path
            d="M12 9L15 16H9L12 9Z"
            fill="#FEFAE0"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="ascent-gradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D4A373" />
              <stop offset="0.5" stopColor="#E9EDC9" />
              <stop offset="1" stopColor="#CCD5AE" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showWordmark && (
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`font-heading font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FAEDCD] to-[#D4A373] ${textSizeClassName}`}
            >
              Ascent
            </span>
            <span className="text-[10px] font-subheading font-medium tracking-wider px-2 py-0.5 rounded-full bg-[#141517] text-[#D4A373] border border-[#D4A373]/30 shadow-[0_0_10px_rgba(212,163,115,0.1)]">
              TECH CLUB
            </span>
          </div>
          {showMotto && (
            <p className="text-xs font-subheading text-[#8E9296] tracking-normal mt-0.5">
              Fueling ideas, shaping futures
            </p>
          )}
        </div>
      )}
    </div>
  );
}
