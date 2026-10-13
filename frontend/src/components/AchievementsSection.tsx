import React from 'react';
import { motion } from 'motion/react';

interface AchievementsSectionProps {
  accentColor1: string;
  accentColor2: string;
}

const ACHIEVEMENT_GALLERY = [
  { id: 1, src: '/assets/achievements/achievement-1.jpg', alt: 'MindHack Hackathon Certificate Presentation' },
  { id: 2, src: '/assets/achievements/achievement-2.jpg', alt: 'MindHack Student Award Felicitation' },
  { id: 3, src: '/assets/achievements/achievement-3.jpg', alt: 'MindHack Excellence Award Presentation' },
  { id: 4, src: '/assets/achievements/achievement-4.jpg', alt: 'MindHack Winner Certificate Ceremony' },
];

export const AchievementsSection: React.FC<AchievementsSectionProps> = () => {
  return (
    <section id="achievements" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-200 dark:border-[#545454]/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 dark:text-white mb-4">
            Achievements
          </h2>

          <p className="font-body text-base text-slate-600 dark:text-[#A6A6A6] leading-relaxed">
            Honouring the achievements that reflect the talent, innovation and spirit of Ascent
          </p>
        </motion.div>
      </div>

      {/* Continuous Motion Track for Achievement Images */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Edge Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-[#FAF8F5] dark:from-[#000000] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-[#FAF8F5] dark:from-[#000000] to-transparent z-20 pointer-events-none" />

        {/* Moving Row with Continuous Seamless Motion */}
        <div className="flex w-max animate-marquee-scroll cursor-grab active:cursor-grabbing">
          {/* Primary Track */}
          <div className="flex items-center gap-6 pr-6">
            {ACHIEVEMENT_GALLERY.map((img) => (
              <div
                key={`achieve-track1-${img.id}`}
                className="group relative flex-shrink-0 w-[320px] sm:w-[440px] h-[220px] sm:h-[300px] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#545454]/40 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-300"
              >
                {/* MINDHACK.AI in Caps in the Left Corner */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="font-heading text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-lg">
                    MINDHACK.AI
                  </span>
                </div>

                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Secondary Track (Seamless Loop) */}
          <div className="flex items-center gap-6 pr-6" aria-hidden="true">
            {ACHIEVEMENT_GALLERY.map((img) => (
              <div
                key={`achieve-track2-${img.id}`}
                className="group relative flex-shrink-0 w-[320px] sm:w-[440px] h-[220px] sm:h-[300px] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#545454]/40 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-300"
              >
                {/* MINDHACK.AI in Caps in the Left Corner */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="font-heading text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-lg">
                    MINDHACK.AI
                  </span>
                </div>

                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
