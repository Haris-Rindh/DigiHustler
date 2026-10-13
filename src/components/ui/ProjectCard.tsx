import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

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
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onInspect,
  className = '',
}) => {
  const liveUrl = project.projectUrl || 'https://github.com/DigiHust-Official';

  return (
    <div
      className={`group relative rounded-[24px] overflow-hidden bg-[#073547] text-white border border-white/10 flex flex-col justify-between h-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(2,43,58,0.25)] select-none ${className}`}
    >
      <div>
        {/* ── 16:9 FLUSH IMAGE (No crop, object-fit: contain on surface color, zero overlays) ── */}
        <div className="w-full aspect-[16/9] overflow-hidden bg-[#022B3A] flex items-center justify-center">
          <img
            src={project.img}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* ── CARD BODY (Category + tech chips, title, description) ── */}
        <div className="p-5 sm:p-6 pb-2">
          {/* Category Chip + Tech Chips (Translucent chips on dark surface) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#1F7A8C]/30 text-cyan-300 border border-cyan-400/20">
              {project.category}
            </span>
            {project.client && (
              <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                {project.client}
              </span>
            )}
            {project.tags && project.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-md bg-white/[0.08] text-white/70 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title in Outfit 600, 18px, 2-line clamp */}
          <h3 className="font-display font-semibold text-[18px] text-white leading-snug line-clamp-2 mb-2">
            {project.title}
          </h3>

          {/* Description: 2-line clamp */}
          <p className="text-[13px] text-white/75 leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>
        </div>
      </div>

      {/* ── DUAL ACTIONS (Inspect Case Study → & Live Demo ↗) ── */}
      <div className="p-5 sm:p-6 pt-3 mt-auto border-t border-white/10 grid grid-cols-2 gap-2.5">
        {/* Solid White Pill Primary Action (Dark teal text) */}
        <button
          type="button"
          onClick={() => onInspect(project)}
          className="h-11 px-3.5 rounded-full bg-white text-[#022B3A] font-sans font-bold text-xs inline-flex items-center justify-center space-x-1.5 shadow-sm hover:bg-slate-100 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <span>Inspect Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>

        {/* Outlined White Pill Action */}
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-3.5 rounded-full bg-transparent text-white border border-white/30 font-sans font-bold text-xs inline-flex items-center justify-center space-x-1.5 hover:bg-white/10 hover:border-white/60 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
        >
          <span>Live Demo</span>
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        </a>
      </div>
    </div>
  );
};
