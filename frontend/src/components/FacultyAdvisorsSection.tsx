import React from 'react';
import { motion } from 'motion/react';

interface FacultyAdvisorsSectionProps {
  accentColor1: string;
  accentColor2: string;
}

export const FacultyAdvisorsSection: React.FC<FacultyAdvisorsSectionProps> = () => {
  const advisorCards = [
    {
      id: 1,
      name: 'Nazneen Ahmed',
      image: '/assets/advisors/faculty-advisor-1.jpg',
      tag: 'ASCENT // FACULTY ADVISOR // 01',
    },
    {
      id: 2,
      name: null,
      image: null,
      tag: 'ASCENT // FACULTY ADVISOR // 02',
    },
  ];

  return (
    <section id="faculty-advisors" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-200 dark:border-[#545454]/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-2 mb-12"
        >
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
            Faculty Advisors
          </h2>
        </motion.div>

        {/* 2 Cards Grid with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {advisorCards.map((card, idx) => (
            <div key={card.id} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="w-full group relative flex flex-col justify-between p-8 rounded-2xl border border-slate-200/90 dark:border-[#545454]/40 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl min-h-[380px] sm:min-h-[440px] transition-all duration-300 hover:border-slate-400 dark:hover:border-[#A6A6A6] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                {card.image ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={card.image}
                      alt={card.name || 'Faculty Advisor'}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <>
                    {/* Clean Top Layout Watermark for blank cards */}
                    <div className="flex justify-between items-start opacity-20 group-hover:opacity-60 transition-opacity">
                      <div className="w-2.5 h-2.5 rounded-full border border-slate-400 dark:border-[#A6A6A6]" />
                      <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-[#A6A6A6]">
                        {card.tag}
                      </span>
                    </div>

                    {/* Clean Bottom Subtle Corner Accent */}
                    <div className="flex justify-between items-end opacity-20 group-hover:opacity-40 transition-opacity">
                      <div className="h-[1px] w-12 bg-slate-400 dark:bg-white/30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/30" />
                    </div>
                  </>
                )}
              </motion.div>
              {card.name && (
                <div className="mt-4 text-center">
                  <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {card.name}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultyAdvisorsSection;
