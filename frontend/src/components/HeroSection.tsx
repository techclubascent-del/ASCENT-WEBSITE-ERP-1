import React from 'react';
import { motion } from 'motion/react';
import { AscentLogo } from './AscentLogo';
import { UserPlus } from 'lucide-react';

interface HeroSectionProps {
  accentColor1: string;
  accentColor2: string;
  onExploreClick?: () => void;
  onLaunchLabClick?: () => void;
  onRegisterClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  accentColor1,
  accentColor2,
  onRegisterClick,
}) => {
  return (
    <>
      {/* 1. Dedicated Clean Hero Stage with Centered ASCENT Branding */}
      <section
        id="home"
        className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col items-center justify-center pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
        aria-label="ASCENT Hero Stage"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute inset-0 m-auto w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full blur-3xl opacity-20 dark:opacity-25 pointer-events-none transition-colors duration-500"
          style={{
            background: `radial-gradient(circle, #D4A373 0%, ${accentColor1} 50%, ${accentColor2} 85%, transparent 100%)`,
          }}
        />

        {/* Center Space: ASCENT Logo + ASCENT Word + Tagline + Register Button */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative my-auto flex flex-col items-center text-center z-10 space-y-5 select-none max-w-2xl mx-auto"
        >
          {/* Centered Large Vector Emblem */}
          <div className="p-4 rounded-3xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg mb-2">
            <AscentLogo size={80} showWordmark={false} variant="monochrome" />
          </div>

          {/* ASCENT Title */}
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-[0.22em] text-[#1E1E1E] dark:text-white leading-none pl-2">
            ASCENT
          </h1>

          {/* Tagline exactly below */}
          <p className="font-body text-base sm:text-xl md:text-2xl font-normal text-[#545454] dark:text-[#A6A6A6] tracking-wide">
            Fueling ideas,Shaping Futures
          </p>

          {/* Register Button Aligned in Center with Tagline */}
          <div className="pt-3">
            <button
              onClick={onRegisterClick}
              className="font-quicksand font-bold text-sm sm:text-base px-8 py-3.5 rounded-full bg-[#D4A373] text-black hover:bg-[#c69363] dark:bg-[#D4A373] dark:text-black dark:hover:bg-[#dfad7d] shadow-[0_4px_22px_rgba(212,163,115,0.35)] hover:shadow-[0_6px_28px_rgba(212,163,115,0.45)] transition-all duration-300 active:scale-95 cursor-pointer tracking-wider uppercase flex items-center gap-2.5 group"
              style={{ fontFamily: "'Quicksand', -apple-system, sans-serif" }}
              id="hero-register-btn"
            >
              <UserPlus size={17} className="transition-transform group-hover:scale-110 text-black" />
              <span>Register</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. Platform Overview Section */}
      <section
        id="overview"
        className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#545454]/15 dark:border-[#545454]/30 bg-white/40 dark:bg-transparent backdrop-blur-sm z-10"
      >
        <div className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center space-y-6"
          >
            {/* Primary Heading */}
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#1E1E1E] dark:text-white leading-[1.12]">
              Ascend Beyond <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E1E1E] via-[#545454] to-[#1E1E1E] dark:from-white dark:via-[#A6A6A6] dark:to-white">
                The Horizon of
              </span>{' '}
              <span
                className="underline decoration-2 underline-offset-8"
                style={{ textDecorationColor: accentColor1 }}
              >
                Innovation
              </span>
            </h2>

            {/* Body Text */}
            <p className="font-body text-base sm:text-lg text-[#545454] dark:text-[#A6A6A6] max-w-2xl leading-relaxed">
              ASCENT is the premier public infrastructure empowering visionary engineers, researchers,
              and ventures. Discover frontier opportunities, access non-dilutive R&D resources, and deploy
              autonomous, quantum, and aerospace architectures.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
