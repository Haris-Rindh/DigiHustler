import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, TrendingUp } from 'lucide-react';
import { getServiceIcon } from '../../lib/serviceIcons';
import { getServiceDedicatedRoute } from '../../lib/serviceRoutes';
import slide1 from '../../assets/slideshow 1.avif';

export interface ServiceCardData {
  id?: string;
  slug?: string;
  title: string;
  description?: string;
  tagline?: string;
  summary?: string;
  tags?: string[];
  features?: string[];
  color?: string;
  icon?: any;
  imageUrl?: string;
  linkTarget?: string;
}

interface ServiceCardProps {
  service: ServiceCardData;
  className?: string;
  onClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  className = '',
  onClick,
}) => {
  // Safe image resolution: use imageUrl or existing fallback
  let imageSrc = service.imageUrl;
  if (!imageSrc || imageSrc.trim() === '') {
    if (service.title.toLowerCase().includes('web') || service.title.toLowerCase().includes('engineering')) {
      imageSrc = slide1;
    } else {
      imageSrc = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
    }
  }

  // Safe icon resolution (observation fix: ensure Digital Marketing never uses red shield or sparkles)
  let iconElement: React.ReactNode = null;
  const isMarketing = service.title.toLowerCase().includes('marketing') || service.title.toLowerCase().includes('seo');
  
  if (isMarketing) {
    iconElement = <TrendingUp className="w-4 h-4 stroke-[2.2] text-[#1F7A8C]" />;
  } else if (typeof service.icon === 'string') {
    iconElement = getServiceIcon(service.icon, 'w-4 h-4 stroke-[2.2] text-[#1F7A8C]');
  } else if (React.isValidElement(service.icon)) {
    iconElement = service.icon;
  }

  const tags = service.features && service.features.length > 0 
    ? service.features 
    : service.tags && service.tags.length > 0 
    ? service.tags 
    : ['Production Ready', 'Milestone SLAs'];

  // Resolve specific and dedicated service landing page
  const targetLink = getServiceDedicatedRoute(service);
  const descriptionText = service.description || service.summary || service.tagline || '';

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between h-full transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-[#1F7A8C]/50 ${className}`}
    >
      <div>
        {/* ── FLUSH TOP IMAGE (Zero space, no image zoom or filter animation) ── */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[var(--bg-subtle)]">
          <img
            src={imageSrc}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay to enhance badge contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

          {/* ── ICON BADGE (Top-left, inset 14px on image) ── */}
          {iconElement && (
            <div className="absolute top-3.5 left-3.5 w-9 h-9 rounded-xl flex items-center justify-center bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-md pointer-events-none">
              {iconElement}
            </div>
          )}
        </div>

        {/* ── CARD BODY (20-24px padding) ── */}
        <div className="px-5 sm:px-6 pt-5 pb-2">
          <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--text-heading)] leading-snug mb-2 group-hover:text-[var(--brand-teal)] dark:group-hover:text-cyan-300 transition-colors">
            {service.title}
          </h3>

          <p className="text-xs sm:text-sm text-[var(--text-body)] line-clamp-2 leading-relaxed mb-4">
            {descriptionText}
          </p>

          {/* Tag Chips */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-md bg-[var(--bg-subtle)] text-[var(--text-body)] border border-[var(--border-subtle)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── CARD FOOTER & LINK (Explore Service ›) ── */}
      <div className="px-5 sm:px-6 pb-5 pt-3 mt-auto border-t border-[var(--border-subtle)] flex items-center justify-between">
        <Link
          to={targetLink}
          className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--brand-teal)] dark:text-cyan-400 hover:underline transition-colors"
        >
          <span>Explore Service</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
