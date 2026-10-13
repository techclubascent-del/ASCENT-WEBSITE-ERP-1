import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EventItem } from '../types';
import { api, ApiEvent } from '../lib/api';

interface EventsSectionProps {
  accentColor1: string;
  accentColor2: string;
  onRegisterEvent?: (event: EventItem) => void;
}

const EVENT_GALLERY = [
  { id: 1, src: '/assets/events/event-1.jpg', alt: 'Ascent Hackathon Lab Session' },
  { id: 2, src: '/assets/events/event-2.jpg', alt: 'Team Project Collaboration' },
  { id: 3, src: '/assets/events/event-3.jpg', alt: 'Technical Workshop & Seminar' },
  { id: 4, src: '/assets/events/event-4.jpg', alt: 'Keynote & Projector Hall Presentation' },
  { id: 5, src: '/assets/events/event-5.jpg', alt: 'Engineering Review & Mentorship' },
];


export const EventsSection: React.FC<EventsSectionProps> = () => {
  const [, setBackendEvents] = useState<ApiEvent[]>([]);

  useEffect(() => {
    api.events
      .list()
      .then((data) => {
        if (Array.isArray(data)) {
          setBackendEvents(data);
        }
      })
      .catch((err) => {
        // Backend offline or error - gracefully fall back to default
        console.debug('Events API response deferred:', err.message);
      });
  }, []);

  return (
    <section id="events" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-200 dark:border-[#545454]/30 overflow-hidden">
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
      </div>

      {/* Straight Line Continuous Motion Track */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Left & Right Edge Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-[#FAF8F5] dark:from-[#000000] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-[#FAF8F5] dark:from-[#000000] to-transparent z-20 pointer-events-none" />

        {/* Moving Row in a Straight Line with Motion */}
        <div className="flex w-max animate-marquee-scroll">
          {/* Primary Track */}
          <div className="flex items-center gap-6 pr-6">
            {EVENT_GALLERY.map((img) => (
              <div
                key={`track1-${img.id}`}
                className="group relative flex-shrink-0 w-[300px] sm:w-[420px] h-[200px] sm:h-[280px] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#545454]/40 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-300"
              >
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
            {EVENT_GALLERY.map((img) => (
              <div
                key={`track2-${img.id}`}
                className="group relative flex-shrink-0 w-[300px] sm:w-[420px] h-[200px] sm:h-[280px] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#545454]/40 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-300"
              >
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

      {/* Moving Line in Motion: Techfest 2025 */}
      <div className="relative w-full overflow-hidden mt-6 py-3 border-y border-slate-200/60 dark:border-[#545454]/25 bg-slate-50/50 dark:bg-white/[0.02]">
        {/* Left & Right Edge Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAF8F5] dark:from-[#000000] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAF8F5] dark:from-[#000000] to-transparent z-20 pointer-events-none" />

        <div className="flex w-max animate-marquee-text select-none">
          {/* Primary Track */}
          <div className="flex items-center gap-8 pr-8 whitespace-nowrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`techfest-track1-${i}`} className="flex items-center gap-8">
                <span className="font-heading text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-slate-800 dark:text-white">
                  techfest 2025
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/40" />
              </div>
            ))}
          </div>

          {/* Secondary Track for Seamless Loop */}
          <div className="flex items-center gap-8 pr-8 whitespace-nowrap" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`techfest-track2-${i}`} className="flex items-center gap-8">
                <span className="font-heading text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-slate-800 dark:text-white">
                  techfest 2025
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
