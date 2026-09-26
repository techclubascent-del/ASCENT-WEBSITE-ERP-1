import React from 'react';
import { motion } from 'motion/react';
import { Compass, Eye, Target } from 'lucide-react';

interface AboutSectionProps {
  accentColor1: string;
  accentColor2: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  accentColor1,
  accentColor2,
}) => {
  const pillars = [
    {
      icon: Compass,
      title: 'Mission',
      desc: 'Centralized curation of funded fellowships, moonshot research grants, and high-altitude flight allocations for deep-tech engineers.',
    },
    {
      icon: Eye,
      title: 'Vision',
      desc: 'Architected with strict functional boundaries, real-time telemetry APIs, and lightweight high-performance rendering layers.',
    },
    {
      icon: Target,
      title: 'Objectives',
      desc: 'Direct testbed access for cryogenic quantum annealers, autonomous drone swarms, and sub-orbital atmospheric payloads.',
    },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start max-w-3xl mb-16"
        >
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#1E1E1E] dark:text-white mb-6">
            Know More
          </h2>

          <p className="font-body text-base sm:text-lg text-[#545454] dark:text-[#A6A6A6] leading-relaxed">
            ASCENT is structured around an uncompromising standard: remove clutter, maximize
            clarity, and give builders direct access to the frontier of scientific and engineering
            endeavors. We bridge pure research with real-world deployment.
          </p>
        </motion.div>

        {/* 3 Pillars Grid: Mission, Vision, Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isBlue = idx % 2 === 0;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative p-7 rounded-2xl border border-[#545454]/20 dark:border-[#545454]/40 bg-white dark:bg-[#080808]/80 backdrop-blur-md transition-all duration-300 hover:border-[#D4A373] dark:hover:border-[#A6A6A6] hover:-translate-y-1 shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors border border-[#545454]/20 dark:border-[#545454]/50 bg-[#FAF8F5] dark:bg-[#121212]"
                    style={{
                      color: isBlue ? accentColor1 : accentColor2,
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  <h3 className="font-heading text-lg font-bold uppercase text-[#1E1E1E] dark:text-white mb-3 tracking-wide">
                    {pillar.title}
                  </h3>

                  <p className="font-body text-sm text-[#545454] dark:text-[#A6A6A6] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Subtle bottom edge accent on hover */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                  style={{ backgroundColor: isBlue ? accentColor1 : accentColor2 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
