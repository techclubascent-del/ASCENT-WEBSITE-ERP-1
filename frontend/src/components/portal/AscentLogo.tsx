interface AscentLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showMotto?: boolean;
  className?: string;
}

export function AscentLogo({ size = 'md', showMotto = false, className = '' }: AscentLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sleek rounded square brand mark inspired by the reference image logo */}
      <div
        className={`relative flex items-center justify-center rounded-xl p-2 bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] shadow-md group hover:border-[#D4A373]/60 transition-colors duration-300 ${iconSizes[size]}`}
      >
        <img
          src="/assets/ascent-mark-exact.svg"
          alt="ASCENT Emblem"
          className="w-full h-full object-cover"
        />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span
            className={`font-heading font-extrabold tracking-tight text-gray-900 dark:text-white ${textSizes[size]}`}
          >
            Ascent
          </span>
          <span className="text-[10px] font-subheading font-medium tracking-wider px-2 py-0.5 rounded-full bg-gray-50 dark:bg-[#141517] text-[#D4A373] border border-[#D4A373]/30">
            TECH CLUB
          </span>
        </div>
        {showMotto && (
          <p className="text-xs font-subheading text-gray-500 dark:text-[#8E9296] tracking-normal mt-0.5">
            Fueling ideas, shaping futures
          </p>
        )}
      </div>
    </div>
  );
}
