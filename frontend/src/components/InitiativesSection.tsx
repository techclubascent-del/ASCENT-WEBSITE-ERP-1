import React from 'react';
import { motion } from 'motion/react';
import { INITIATIVES } from '../data/platformData';
import { InitiativeItem } from '../types';

interface InitiativesSectionProps {
  accentColor1: string;
  accentColor2: string;
  onSelectInitiative?: (initiative: InitiativeItem) => void;
}

export const InitiativesSection: React.FC<InitiativesSectionProps> = () => {
  const initiativeCards = [
    {
      id: 'init-1',
      image: '/assets/initiatives/24-hour-hackathon.jpg',
      title: '24 Hour Hackathon',
      tag: 'ASCENT // INITIATIVE // 01',
    },
    {
      id: 'init-2',
      image: '/assets/initiatives/workshop.jpg',
      title: 'Workshop',
      tag: 'ASCENT // INITIATIVE // 02',
    },
    {
      id: 'init-3',
      image: '/assets/initiatives/tech-fest.jpg',
      title: 'Tech Fest',
      tag: 'ASCENT // INITIATIVE // 03',
    },
  ];

  return (
    <section id="initiatives" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-[#545454]/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
              Initiatives
            </h2>
          </div>
        </motion.div>

        {/* Initiatives Cards Grid with Staggered Scroll Animation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {initiativeCards.map((card, idx) => {
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col justify-between p-7 rounded-2xl border border-slate-200/90 dark:border-[#545454]/30 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl min-h-[220px] sm:min-h-[260px] transition-all duration-300 hover:border-slate-400 dark:hover:border-[#A6A6A6] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                {card.image ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={card.image}
                      alt={card.title || 'Initiative'}
                      title={card.title || 'Initiative'}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-6">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/70 block mb-1">
                          {card.tag}
                        </span>
                        <h3 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-white drop-shadow">
                          {card.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Clean Top Layout Watermark */}
                    <div className="flex justify-between items-start opacity-20 group-hover:opacity-60 transition-opacity">
                      <div className="w-2 h-2 rounded-full border border-slate-400 dark:border-[#A6A6A6]" />
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
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InitiativesSection;
