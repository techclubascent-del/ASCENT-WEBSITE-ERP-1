import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TEAM } from '../data/platformData';
import { Linkedin, Github, Twitter } from 'lucide-react';

interface TeamSectionProps {
  accentColor1: string;
  accentColor2: string;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  accentColor1,
  accentColor2,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Replicated cards list for continuous seamless marquee loop
  const marqueeList = [...TEAM, ...TEAM, ...TEAM, ...TEAM];

  const handleToggleFlip = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="team" className="relative py-24 z-10 border-t border-slate-200 dark:border-[#545454]/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-2"
        >
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
            The Team
          </h2>
          <p className="font-body text-xs sm:text-sm text-slate-500 dark:text-[#A6A6A6]">
            Double click any card to reveal profile details
          </p>
        </motion.div>
      </div>

      {/* Infinite Leftward Running Marquee Track with 3D Flip Cards */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full overflow-hidden py-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Edge Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF8F5] dark:from-[#000000] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF8F5] dark:from-[#000000] to-transparent z-20 pointer-events-none" />

        {/* Continuous Left-Running Track */}
        <motion.div
          className="flex items-stretch gap-6 w-max"
          animate={isPaused ? {} : { x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 35,
              ease: 'linear',
            },
          }}
        >
          {marqueeList.map((member, idx) => {
            const isFlipped = !!flippedCards[idx];

            return (
              <div
                key={idx}
                className="w-[280px] sm:w-[320px] h-[400px] sm:h-[440px] shrink-0 select-none cursor-pointer [perspective:1200px]"
                onDoubleClick={(e) => handleToggleFlip(idx, e)}
              >
                {/* 3D Flippable Container */}
                <div
                  className="relative w-full h-full duration-700 transition-transform [transform-style:preserve-3d]"
                  style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* FRONT FACE (Photo + Minimal Emblem + Watermark) */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl border border-slate-200/90 dark:border-[#545454]/40 bg-white dark:bg-[#090909] backdrop-blur-xl shadow-md hover:shadow-2xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between [backface-visibility:hidden]">
                    {/* Background Portrait Image with Vignette */}
                    {member.image ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-center filter grayscale contrast-[1.05] brightness-90 hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5] to-slate-200 dark:from-[#111111] dark:to-[#050505]" />
                    )}

                    {/* Top Watermark & Initials Badge */}
                    <div className="relative z-10 p-5 flex justify-between items-start">
                      <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] uppercase tracking-widest">
                        ASCENT // TEAM
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-white/20 dark:bg-black/60 backdrop-blur-md border border-white/30 text-white font-heading font-bold text-xs flex items-center justify-center shadow-sm">
                        {member.initials}
                      </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="relative z-10 p-5 text-white">
                      <h3 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-wide drop-shadow-md">
                        {member.name}
                      </h3>
                      <p className="font-body text-xs text-white/80 line-clamp-1 mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* BACK FACE (Detailed Profile Information) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl border border-slate-200/90 dark:border-[#545454]/60 bg-white/95 dark:bg-[#0d0d0d]/95 backdrop-blur-2xl shadow-xl p-6 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden]"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-[#545454]/40">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-[#A6A6A6]">
                          MEMBER PROFILE
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${accentColor1}20`,
                            color: accentColor1,
                            borderColor: `${accentColor1}40`,
                          }}
                        >
                          {member.initials}
                        </span>
                      </div>

                      {/* Name & Role */}
                      <div className="mt-4 space-y-1">
                        <h3 className="font-heading text-xl font-bold uppercase text-slate-900 dark:text-white leading-tight">
                          {member.name}
                        </h3>
                        <p
                          className="font-body text-xs font-semibold"
                          style={{ color: accentColor2 }}
                        >
                          {member.role}
                        </p>
                      </div>

                      {/* Domain Badge */}
                      <div className="mt-3">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-[#545454]/40 text-slate-700 dark:text-[#d4d4d4] font-body text-[11px] font-medium">
                          {member.domain}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="font-body text-xs sm:text-[13px] text-slate-600 dark:text-[#a0a0a0] leading-relaxed mt-4 line-clamp-4">
                        {member.bio}
                      </p>
                    </div>

                    {/* Socials & Card Footer */}
                    <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-[#545454]/40">
                      {/* Social Icons */}
                      <div className="flex items-center gap-2">
                        {member.socials?.linkedin && (
                          <a
                            href={member.socials.linkedin}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-[#545454]/40 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors"
                            aria-label="LinkedIn"
                          >
                            <Linkedin size={14} />
                          </a>
                        )}
                        {member.socials?.github && (
                          <a
                            href={member.socials.github}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-[#545454]/40 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-black dark:hover:bg-black transition-colors"
                            aria-label="GitHub"
                          >
                            <Github size={14} />
                          </a>
                        )}
                        {member.socials?.x && (
                          <a
                            href={member.socials.x}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-[#545454]/40 text-slate-700 dark:text-slate-300 hover:text-white hover:bg-black dark:hover:bg-black transition-colors"
                            aria-label="X (Twitter)"
                          >
                            <Twitter size={14} />
                          </a>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between text-[11px] font-body text-slate-500 dark:text-[#A6A6A6]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#A6A6A6]">
                          PROFILE VERIFIED
                        </span>
                        <span className="font-mono text-[10px]">ASCENT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default TeamSection;
