import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PROJECTS } from '../data/platformData';
import { ProjectItem } from '../types';

interface ProjectsSectionProps {
  accentColor1: string;
  accentColor2: string;
  onSelectProject?: (project: ProjectItem) => void;
}

const PROJECT_IMAGES: Record<string, string> = {
  'proj-1': '/assets/projects/project-1.jpg',
  'proj-2': '/assets/projects/project-2.jpg',
  'proj-3': '/assets/projects/project-3.jpg',
  'proj-4': '/assets/projects/project-4.jpg',
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Live Projects');

  const categories = ['Live Projects', 'Upcoming Projects'];

  const filteredProjects =
    selectedCategory === 'Live Projects'
      ? PROJECTS.filter((p) => p.status === 'Active' || p.status === 'Deployed')
      : PROJECTS.filter((p) => p.status === 'Research' || p.status === 'Incubating');

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

        {/* Projects Cards Grid with Dummy Pictures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => {
            const imageSrc = PROJECT_IMAGES[project.id] || '/assets/projects/project-1.jpg';
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
                whileHover={{ y: -6 }}
                className="group relative flex flex-col justify-between p-8 rounded-2xl border border-slate-200/90 dark:border-[#545454]/40 bg-white/70 dark:bg-[#070707]/90 backdrop-blur-xl min-h-[300px] sm:min-h-[360px] transition-all duration-300 hover:border-slate-400 dark:hover:border-[#A6A6A6] shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={imageSrc}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
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
