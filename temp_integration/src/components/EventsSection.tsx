import React from 'react';
import { motion } from 'motion/react';
import { EVENTS } from '../data/platformData';
import { EventItem } from '../types';

interface EventsSectionProps {
  accentColor1: string;
  accentColor2: string;
  onRegisterEvent?: (event: EventItem) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = () => {
  return (
    <section id="events" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-200 dark:border-[#545454]/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
              Curated Events &amp; Hackathons
            </h2>
          </div>
        </motion.div>

        {/* Empty Events Cards with Staggered Scroll Animation */}
        <div className="space-y-4">
          {EVENTS.map((event, idx) => {
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ x: 4 }}
                className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-[#545454]/30 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl min-h-[140px] sm:min-h-[160px] transition-all duration-300 hover:border-slate-400 dark:hover:border-[#A6A6A6] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between"
              >
                {/* Clean Top Layout Watermark */}
                <div className="flex justify-between items-start opacity-20 group-hover:opacity-60 transition-opacity">
                  <div className="w-2 h-2 rounded-full border border-slate-400 dark:border-[#A6A6A6]" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-[#A6A6A6]">
                    ASCENT // EVENTS &amp; HACKATHONS
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
      </div>
    </section>
  );
};

export default EventsSection;
