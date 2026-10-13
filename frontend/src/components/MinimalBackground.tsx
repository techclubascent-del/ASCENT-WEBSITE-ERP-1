import React from 'react';

interface MinimalBackgroundProps {
  accentColor1?: string;
  accentColor2?: string;
}

export const MinimalBackground: React.FC<MinimalBackgroundProps> = ({
  accentColor1 = '#004AAD',
  accentColor2 = '#AA0044',
}) => {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none transition-colors duration-300"
      id="ascent-minimal-background"
    >
      {/* Matte Base */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-[#000000] transition-colors duration-300" />

      {/* Subtle Dual Secondary Accent Ambient Radial Gradients with #D4A373 Horizon Glow */}
      <div
        className="absolute -top-[18%] -left-[12%] w-[52vw] h-[52vw] rounded-full blur-[160px] opacity-[0.12] dark:opacity-10 pointer-events-none transition-opacity duration-300"
        style={{ backgroundColor: accentColor1 }}
      />
      <div
        className="absolute top-[35%] -right-[18%] w-[46vw] h-[46vw] rounded-full blur-[180px] opacity-[0.08] dark:opacity-10 pointer-events-none transition-opacity duration-300"
        style={{ backgroundColor: accentColor2 }}
      />
      <div
        className="absolute top-[10%] left-[25%] right-[25%] h-[280px] rounded-full blur-[160px] opacity-[0.07] dark:opacity-[0.09] pointer-events-none"
        style={{ backgroundColor: '#D4A373' }}
      />

      {/* Sleek Technical Micro-Grid Pattern (Light #545454 & Dark #FFFFFF) */}
      <div
        className="absolute inset-0 opacity-[0.05] dark:hidden pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#545454 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.028] hidden dark:block pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Soft Top/Bottom Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-transparent to-[#FAF8F5]/90 dark:from-[#000000]/60 dark:via-transparent dark:to-[#000000]/85 pointer-events-none transition-colors duration-300" />
    </div>
  );
};

export default MinimalBackground;
