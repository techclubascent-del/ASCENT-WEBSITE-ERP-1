import React from 'react';
import { ProjectItem, InitiativeItem } from '../types';
import { X, Activity, CheckCircle2, ArrowUpRight, Cpu } from 'lucide-react';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectItem | null;
  initiative?: InitiativeItem | null;
  accentColor1: string;
  accentColor2: string;
  onApplyForThis: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  initiative,
  accentColor1,
  accentColor2,
  onApplyForThis,
}) => {
  if (!isOpen || (!project && !initiative)) return null;

  const isProject = !!project;
  const title = isProject ? project.title : initiative?.title;
  const subtitle = isProject
    ? `${project.category} Systems • Manifest Year ${project.year}`
    : `${initiative?.code} • ${initiative?.pillar}`;
  const description = isProject ? project.description : initiative?.objective;
  const accent = isProject ? project.accentColor : accentColor1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-[#545454]/50 bg-white dark:bg-[#0c0c0c] p-6 sm:p-8 shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg border border-slate-300 dark:border-[#545454]/40 text-slate-500 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161616] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <span
            className="font-body text-xs font-semibold uppercase tracking-wider block mb-1"
            style={{ color: accent }}
          >
            {isProject ? 'Verified Engineering Dossier' : 'Strategic Program Brief'}
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase text-slate-900 dark:text-white">
            {title}
          </h2>
          <p className="font-body text-xs text-slate-500 dark:text-[#A6A6A6] mt-1">{subtitle}</p>
        </div>

        {/* Description */}
        <div className="font-body text-sm text-slate-700 dark:text-[#d4d4d4] leading-relaxed mb-6 space-y-3">
          <p>{description}</p>
        </div>

        {/* Metrics or Highlights */}
        {isProject && project.metrics && (
          <div className="mb-6">
            <h4 className="font-heading text-xs uppercase tracking-wider text-slate-500 dark:text-[#A6A6A6] mb-3 font-semibold">
              Performance & Telemetry Bounds
            </h4>
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl border border-slate-200 dark:border-[#545454]/40 bg-slate-50 dark:bg-[#121212]">
              {project.metrics.map((m, i) => (
                <div key={i}>
                  <div className="font-heading text-base font-bold text-slate-900 dark:text-white">{m.value}</div>
                  <div className="font-body text-[11px] text-slate-500 dark:text-[#A6A6A6]">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isProject && initiative && (
          <div className="mb-6 space-y-2">
            <h4 className="font-heading text-xs uppercase tracking-wider text-slate-500 dark:text-[#A6A6A6] mb-2 font-semibold">
              Deliverables & Core Milestones
            </h4>
            {initiative.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs font-body text-slate-700 dark:text-[#e2e2e2]">
                <CheckCircle2 size={15} style={{ color: accentColor1 }} className="shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {isProject && project.tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((t) => (
              <span
                key={t}
                className="font-body text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-[#181818] border border-slate-200 dark:border-[#545454]/40 text-slate-600 dark:text-[#A6A6A6]"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-5 border-t border-slate-200 dark:border-[#545454]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-body text-slate-500 dark:text-[#A6A6A6]">
            <Activity size={14} style={{ color: accent }} />
            <span>Open for Collaboration & Peer Review</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="font-button text-xs font-semibold px-4 py-2.5 rounded-xl text-slate-600 dark:text-[#A6A6A6] hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onClose();
                onApplyForThis();
              }}
              className="font-button text-xs font-bold px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-[#EAE4D9] transition-all flex items-center gap-2 shadow-sm dark:shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
            >
              <span>Apply for Placement</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
