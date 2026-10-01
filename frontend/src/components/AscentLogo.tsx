import React from 'react';

interface AscentLogoProps {
  className?: string;
  size?: number | string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  variant?: 'monochrome' | 'accent' | 'silver';
  accentColor?: string;
}

export const AscentLogo: React.FC<AscentLogoProps> = ({
  className = '',
  size = 32,
}) => {
  return (
    <div className={`inline-flex items-center justify-center select-none ${className}`} id="ascent-brand-logo">
      <img
        src="/assets/ascent-logo-exact.svg"
        alt="ASCENT"
        className="ascent-logo"
        style={{ width: size, height: 'auto', objectFit: 'contain' }}
      />
    </div>
  );
};

export default AscentLogo;
