import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SiteServiceItem } from '../../types';
import { getServiceDedicatedRoute } from '../../lib/serviceRoutes';

// Local photography assets for each core capability
import slide1 from '../../assets/slideshow 1.avif';
import slide2 from '../../assets/slideshow 2.jpg';
import slide3 from '../../assets/slideshow 3.jpg';
import slide4 from '../../assets/slideshow 4.jpg';
import slide5 from '../../assets/slideshow 5.jpg';
import slide6 from '../../assets/slideshow 6.jpg';

export interface ServiceFeatureRowProps {
  service: SiteServiceItem;
  index: number;
  isFirst?: boolean;
}

const SERVICE_IMAGES = [slide1, slide2, slide3, slide4, slide5, slide6];

export const getServiceImage = (service: SiteServiceItem, index: number): string => {
  const combined = `${service.slug || ''} ${service.title || ''} ${service.id || ''}`.toLowerCase();

  if (
    combined.includes('web') ||
    combined.includes('saas') ||
    combined.includes('dev') ||
    combined.includes('engineering')
  ) {
    return slide1;
  }
  if (
    combined.includes('creative') ||
    combined.includes('brand') ||
    combined.includes('ui') ||
    combined.includes('ux') ||
    combined.includes('design')
  ) {
    return slide2;
  }
  if (
    combined.includes('ai') ||
    combined.includes('automation') ||
    combined.includes('workflow')
  ) {
    return slide3;
  }
  if (
    combined.includes('market') ||
    combined.includes('seo') ||
    combined.includes('growth')
  ) {
    return slide4;
  }
  if (
    combined.includes('cyber') ||
    combined.includes('security') ||
    combined.includes('audit')
  ) {
    return slide5;
  }
  if (
    combined.includes('data') ||
    combined.includes('intelligence') ||
    combined.includes('bi') ||
    combined.includes('analytic')
  ) {
    return slide6;
  }

  if (service.imageUrl && service.imageUrl.trim() !== '' && !service.imageUrl.includes('unsplash.com')) {
    return service.imageUrl;
  }

  return SERVICE_IMAGES[index % SERVICE_IMAGES.length];
};



export const DEFAULT_SERVICE_BULLETS: Record<string, string[]> = {
  web: [
    'REACT & NEXT.JS WEB APPS',
    'SCALABLE NODE.JS APIS',
    'CROSS-PLATFORM MOBILE APPS',
    'CLOUD INFRASTRUCTURE & DEVOPS',
    'POSTGRESQL & REDIS DATABASES',
    'HIGH-PERFORMANCE ARCHITECTURE',
  ],
  creative: [
    'DESIGN SYSTEMS & FIGMA LIBRARIES',
    'USER EXPERIENCE & INTERFACES',
    'BRAND IDENTITY GUIDELINES',
    'INTERACTIVE 3D VISUALS',
    'PROTOTYPES & WIREFRAMES',
    'HIGH-CONVERSION LANDING PAGES',
  ],
  ai: [
    'AUTONOMOUS LLM AGENTS',
    'N8N & MAKE.COM AUTOMATION',
    'CUSTOM AI CHATBOTS',
    'INTELLIGENT ETL PIPELINES',
    'API INTEGRATION WORKFLOWS',
    'ENTERPRISE PROCESS AUTOMATION',
  ],
  marketing: [
    'TECHNICAL SEO AUDITS',
    'GOOGLE & META PPC ADS',
    'B2B LEAD GENERATION FUNNELS',
    'CONTENT & KEYWORD STRATEGY',
    'CONVERSION RATE OPTIMIZATION',
    'MULTI-CHANNEL CAMPAIGN ANALYTICS',
  ],
  cybersecurity: [
    'PENETRATION TESTING & AUDITS',
    'OWASP VULNERABILITY SCANS',
    'INFRASTRUCTURE HARDENING',
    'API SECURITY VERIFICATION',
    'COMPLIANCE & RISK ASSESSMENT',
    'ZERO-DAY DEFENSE PROTOCOLS',
  ],
  data: [
    'EXECUTIVE POWERBI DASHBOARDS',
    'SQL QUERY OPTIMIZATION',
    'AUTOMATED DATA PIPELINES',
    'BUSINESS INTELLIGENCE METRICS',
    'REAL-TIME KPI TRACKING',
    'PREDICTIVE ANALYTICS SUITES',
  ],
};

const getServiceBullets = (service: SiteServiceItem): string[] => {
  const rawBullets: string[] = service.features || (service as { tags?: string[] }).tags || [];
  if (rawBullets.length >= 4) {
    return rawBullets.slice(0, 6).map((b) => b.toUpperCase());
  }

  const combined = `${service.slug || ''} ${service.title || ''} ${service.id || ''}`.toLowerCase();
  if (
    combined.includes('web') ||
    combined.includes('saas') ||
    combined.includes('dev') ||
    combined.includes('engineering')
  ) {
    return DEFAULT_SERVICE_BULLETS.web;
  }
  if (
    combined.includes('creative') ||
    combined.includes('brand') ||
    combined.includes('ui') ||
    combined.includes('ux') ||
    combined.includes('design')
  ) {
    return DEFAULT_SERVICE_BULLETS.creative;
  }
  if (
    combined.includes('ai') ||
    combined.includes('automation') ||
    combined.includes('workflow')
  ) {
    return DEFAULT_SERVICE_BULLETS.ai;
  }
  if (
    combined.includes('market') ||
    combined.includes('seo') ||
    combined.includes('growth')
  ) {
    return DEFAULT_SERVICE_BULLETS.marketing;
  }
  if (
    combined.includes('cyber') ||
    combined.includes('security') ||
    combined.includes('audit')
  ) {
    return DEFAULT_SERVICE_BULLETS.cybersecurity;
  }
  if (
    combined.includes('data') ||
    combined.includes('intelligence') ||
    combined.includes('bi') ||
    combined.includes('analytic')
  ) {
    return DEFAULT_SERVICE_BULLETS.data;
  }

  return rawBullets.length > 0 ? rawBullets.slice(0, 6).map((b) => b.toUpperCase()) : DEFAULT_SERVICE_BULLETS.web;
};

/**
 * Decorative flourish swirl icon matching the ornamental scroll in the reference design
 */
export const FlourishSwirl: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6 inline-block mr-2 text-[#C48D28] dark:text-[#FBBF24]',
}) => (
  <svg
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 4.5c-4.8 0-8.8 3.5-8.8 7.8 0 4.2 3.8 7.2 8 7.2 4.5 0 7.8-3.2 7.8-6.5 0-2.8-2-4.8-4.8-4.8-2.5 0-4.2 1.8-4.2 3.8 0 1.8 1.4 3 3 3 1.5 0 2.6-1 2.8-2" />
  </svg>
);

export const ServiceFeatureRow: React.FC<ServiceFeatureRowProps> = ({
  service,
  index,
  isFirst = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  // Even index (0, 2, 4): Image Left, Text Right
  // Odd index (1, 3, 5): Text Left, Image Right
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  const slug = service.slug || service.id || `service-${index + 1}`;
  const headingId = `heading-${slug}`;
  const detailRoute = getServiceDedicatedRoute(service);

  const imageSrc = getServiceImage(service, index);
  const bullets = getServiceBullets(service);

  const motionStyle: React.CSSProperties = shouldReduceMotion
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(16px)',
        transition: 'opacity 350ms ease-out, transform 350ms ease-out',
      };

  return (
    <div
      ref={rowRef}
      id={slug}
      aria-labelledby={headingId}
      className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full border-b border-[var(--border-subtle)] last:border-b-0 scroll-mt-[88px]"
    >
      {/* ── IMAGE CELL (16:9 Aspect Ratio) ── */}
      {/* Mobile: always order-1. Desktop: Even is order-1 (Col 1), Odd is order-2 (Col 2) */}
      <div
        style={motionStyle}
        className={`w-full aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-[var(--border-subtle)] md:border-b-0 ${
          isEven
            ? 'order-1 md:order-1 md:border-r md:border-[var(--border-subtle)]'
            : 'order-1 md:order-2'
        }`}
      >
        <img
          src={imageSrc}
          alt={service.title}
          width={640}
          height={360}
          loading={isFirst ? 'eager' : 'lazy'}
          fetchPriority={isFirst ? 'high' : 'auto'}
          decoding="async"
          className="w-full h-full object-cover rounded-none block select-none"
        />
      </div>

      {/* ── TEXT CELL ── */}
      {/* Mobile: always order-2. Desktop: Even is order-2 (Col 2), Odd is order-1 (Col 1) */}
      <div
        style={motionStyle}
        className={`w-full flex flex-col items-center justify-center p-6 sm:p-8 md:p-8 lg:p-10 text-center bg-[var(--bg-page)] ${
          isEven
            ? 'order-2 md:order-2'
            : 'order-2 md:order-1 md:border-r md:border-[var(--border-subtle)]'
        }`}
      >
        {/* Title with Swirl Glyph (No emoji) */}
        <h2
          id={headingId}
          className="font-display font-bold text-xl sm:text-2xl md:text-2xl lg:text-[28px] text-[#B8860B] dark:text-[#FBBF24] tracking-tight flex items-center justify-center gap-2 mb-4 sm:mb-5"
        >
          <FlourishSwirl className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span>{service.title}</span>
        </h2>

        {/* Uppercase Left-Aligned Bullets Container */}
        <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto text-left mb-6">
          <ul className="space-y-2.5 sm:space-y-3 font-sans font-bold text-xs sm:text-[13px] tracking-wider uppercase text-slate-800 dark:text-slate-100">
            {bullets.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-200 shrink-0"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore Service CTA */}
        {detailRoute && (
          <Link
            to={detailRoute}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--brand-teal)] hover:text-[var(--brand-teal-hover)] dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors group mt-2 focus:outline-hidden focus:ring-2 focus:ring-[var(--brand-teal)] rounded-sm"
          >
            <span>Explore Service</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
};
