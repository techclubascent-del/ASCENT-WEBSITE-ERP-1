import React from 'react';
import { motion } from 'motion/react';
import { ACHIEVEMENTS } from '../data/platformData';

interface AchievementsSectionProps {
  accentColor1: string;
  accentColor2: string;
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = () => {
  return (
    <section id="achievements" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-200 dark:border-[#545454]/30">
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
            Quantified breakthroughs from ASCENT innovation clusters deployed across defense,
            commercial aviation, and sovereign quantum research initiatives.
          </p>
        </motion.div>

        {/* 4 Empty Cards with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ACHIEVEMENTS.map((item, idx) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="group relative p-7 rounded-2xl border border-slate-200/90 dark:border-[#545454]/40 bg-white/70 dark:bg-[#080808]/90 backdrop-blur-xl min-h-[220px] sm:min-h-[250px] transition-all duration-300 hover:border-slate-400 dark:hover:border-[#A6A6A6] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between"
              >
                {/* Clean Top Layout Watermark */}
                <div className="flex justify-between items-start opacity-20 group-hover:opacity-60 transition-opacity">
                  <div className="w-2 h-2 rounded-full border border-slate-400 dark:border-[#A6A6A6]" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-[#A6A6A6]">
                    ASCENT // ACHIEVEMENTS
                  </span>
                </div>

                {/* Clean Bottom Subtle Corner Accent */}
                <div className="flex justify-between items-end opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="h-[1px] w-12 bg-slate-400 dark:bg-white/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/30" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Callout Banner without Trophy symbol */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-slate-200 dark:border-[#545454]/50 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 dark:from-[#0d0d0d] dark:via-[#121212] dark:to-[#0d0d0d] p-8 text-center max-w-4xl mx-auto flex flex-col items-center space-y-4 shadow-sm dark:shadow-none"
        >
          <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-slate-900 dark:text-white">
            Accelerating The Next Wave Of Breakthroughs
          </h3>
          <p className="font-body text-xs sm:text-sm text-slate-600 dark:text-[#A6A6A6] max-w-xl">
            Are you leading an advanced research initiative or developing high-performance hardware?
            ASCENT provides immediate evaluation, lab facilities, and non-dilutive capital.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
