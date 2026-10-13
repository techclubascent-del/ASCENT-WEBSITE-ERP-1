import React from 'react';

export const SplinePanther: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] sm:h-[550px] lg:h-[620px] flex items-center justify-center rounded-3xl overflow-hidden border border-[#26282A]/40 bg-[#000000]/60 shadow-2xl backdrop-blur-sm group hover:border-[#00E5FF]/40 transition-colors">
      {/* Subtle ambient glow behind Spline viewer */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 via-blue-500/10 to-[#00E5FF]/5 blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Spline 3D Interactive Panther Viewer */}
      <iframe
        src="https://my.spline.design/pankajmodel-jl8ObktpTiCugdTs2LCDQpj6/"
        frameBorder="0"
        width="100%"
        height="100%"
        title="Spline 3D Interactive Panther"
        className="relative z-10 w-full h-full rounded-3xl pointer-events-auto"
      />
    </div>
  );
};
