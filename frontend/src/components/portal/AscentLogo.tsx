import React from 'react';

interface AscentLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showMotto?: boolean;
  className?: string;
}

export function AscentLogo({ size = 'md', showMotto = false, className = '' }: AscentLogoProps) {
  const iconSizes = {
    sm: 120,
    md: 160,
    lg: 200,
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src="/assets/ascent-logo-exact.svg"
        alt="ASCENT"
        className="ascent-logo"
        style={{ width: iconSizes[size] || 160, height: 'auto', objectFit: 'contain' }}
      />
    </div>
  );
}
