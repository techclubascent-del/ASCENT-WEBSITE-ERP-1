import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/platformData';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  accentColor1: string;
  accentColor2: string;
  onSelectProject?: (project: ProjectItem) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Aerospace', 'Quantum', 'Autonomous', 'AI Systems'];

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 z-10 border-t border-slate-200 dark:border-[#545454]/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Title & Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
              Projects
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-button text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white font-bold border-slate-900 dark:bg-white dark:text-black dark:border-white shadow-sm'
                    : 'bg-white/80 dark:bg-[#111111] text-slate-600 dark:text-[#A6A6A6] border-slate-300/80 dark:border-[#545454]/40 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-[#A6A6A6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Empty Space Container replacing 3D holodeck */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-56 sm:h-72 rounded-2xl border border-dashed border-slate-300/80 dark:border-[#545454]/40 bg-white/40 dark:bg-[#080808]/40 backdrop-blur-sm mb-12 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="w-10 h-10 rounded-xl border border-dashed border-slate-400/60 dark:border-white/20 mb-3 flex items-center justify-center opacity-30" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#A6A6A6]/60">
            ASCENT // PROJECT LAB
          </span>
        </motion.div>

        {/* Projects Cards Grid with Empty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project, idx) => {
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: (idx % 2) * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col justify-between p-7 rounded-2xl border border-slate-200/90 dark:border-[#545454]/30 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl min-h-[220px] sm:min-h-[260px] transition-all duration-300 hover:border-slate-400 dark:hover:border-[#A6A6A6] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
              >
                {/* Clean Top Layout Watermark */}
                <div className="flex justify-between items-start opacity-20 group-hover:opacity-60 transition-opacity">
                  <div className="w-2 h-2 rounded-full border border-slate-400 dark:border-[#A6A6A6]" />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-[#A6A6A6]">
                    ASCENT // PROJECTS
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

export default ProjectsSection;
