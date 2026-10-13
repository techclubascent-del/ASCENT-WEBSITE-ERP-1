import React from 'react';
import { motion } from 'motion/react';

interface FoundersSectionProps {
  accentColor1: string;
  accentColor2: string;
}

export const FoundersSection: React.FC<FoundersSectionProps> = () => {
  const founderCards = [
    {
      id: 1,
      image: '/assets/founders/founder-1.jpg',
      tag: 'ASCENT // FOUNDER // 01',
    },
    {
      id: 2,
      image: '/assets/founders/founder-2.jpg',
      tag: 'ASCENT // FOUNDER // 02',
    },
  ];

  return (
    <section id="founders" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-200 dark:border-[#545454]/30">
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
            The Founders
          </h2>
        </motion.div>

        {/* 2 Cards Grid with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {founderCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                delay: idx * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between p-8 rounded-2xl border border-slate-200/90 dark:border-[#545454]/40 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl min-h-[380px] sm:min-h-[440px] transition-all duration-300 hover:border-slate-400 dark:hover:border-[#A6A6A6] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {card.image && (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={card.image}
                    alt={`Founder ${card.id}`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />
                </div>
              )}

              {/* Clean Top Layout Watermark */}
              <div className="relative z-10 flex justify-between items-start text-white">
                <div className="w-2.5 h-2.5 rounded-full border border-white/60 bg-white/20" />
                <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white">
                  {card.tag}
                </span>
              </div>

              {/* Clean Bottom Subtle Corner Accent */}
              <div className="relative z-10 flex justify-between items-end text-white">
                <div className="h-[1px] w-12 bg-white/40" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
