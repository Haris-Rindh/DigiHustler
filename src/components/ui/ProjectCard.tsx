import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { formatImageUrl, handleImageError } from '../../lib/imageUrlHelper';

export interface ProjectCardData {
  id: string;
  category: string;
  title: string;
  client?: string;
  description: string;
  tags?: string[];
  img: string;
  projectUrl?: string;
}

interface ProjectCardProps {
  project: ProjectCardData;
  onInspect: (project: ProjectCardData) => void;
  className?: string;
  showDescription?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onInspect,
  className = '',
  showDescription = false,
}) => {
  const liveUrl = project.projectUrl || 'https://github.com/DigiHust-Official';
  const resolvedImg = formatImageUrl(project.img, project.category);

  return (
    <div
      className={`group relative rounded-[24px] overflow-hidden bg-[var(--bg-surface)] text-[var(--text-heading)] border border-[var(--border-subtle)] hover:border-[var(--brand-teal)]/50 flex flex-col justify-between h-full transition-all duration-200 ease-out hover:-translate-y-1 shadow-md hover:shadow-xl select-none ${className}`}
    >
      <div>
        {/* ── 16:9 FLUSH IMAGE (No crop, object-fit: contain on surface color, zero overlays) ── */}
        <div className="w-full aspect-[16/9] overflow-hidden bg-[var(--bg-page)] dark:bg-[#022B3A] flex items-center justify-center">
          <img
            src={resolvedImg}
            alt={project.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => handleImageError(e, undefined, project.category)}
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* ── CARD BODY (Category + essential tech chips, title) ── */}
        <div className="p-4 sm:p-5 pb-3">
          {/* Category Chip + Primary Tech Chips (Single clean row) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
            <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--brand-teal)]/30">
              {project.category}
            </span>
            {project.tags && project.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-md bg-[var(--bg-page)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title in Outfit 600, 16px sm:17px, clean leading */}
          <h3 className="font-display font-semibold text-[16px] sm:text-[17px] text-[var(--text-heading)] leading-snug line-clamp-2">
            {project.title}
          </h3>

          {/* Optional description (omitted by default to keep height compact) */}
          {showDescription && (
            <p className="text-[13px] text-[var(--text-body)] leading-relaxed line-clamp-2 mt-2">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* ── DUAL ACTIONS (Inspect Case Study → & Live Demo ↗) ── */}
      <div className="px-4 sm:px-5 py-3.5 mt-auto border-t border-[var(--border-subtle)] grid grid-cols-2 gap-2">
        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => onInspect(project)}
          className="h-9 sm:h-10 px-3 rounded-full bg-[#1F7A8C] text-white hover:bg-[#14535F] dark:bg-white dark:text-[#022B3A] dark:hover:bg-slate-100 font-sans font-bold text-xs inline-flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] cursor-pointer"
        >
          <span>Inspect Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>

        {/* Outlined Action Button */}
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 sm:h-10 px-3 rounded-full bg-transparent text-[var(--text-heading)] border border-[var(--border-strong)]/40 hover:bg-[var(--bg-subtle)] hover:border-[var(--brand-teal)] dark:text-white dark:border-white/30 dark:hover:bg-white/10 dark:hover:border-white/60 font-sans font-bold text-xs inline-flex items-center justify-center space-x-1.5 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] cursor-pointer"
        >
          <span>Live Demo</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
      </div>
    </div>
  );
};
