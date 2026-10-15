import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { SiteServiceItem } from '../../types';
import { getServiceDedicatedRoute } from '../../lib/serviceRoutes';

export interface ServiceFeatureRowProps {
  service: SiteServiceItem;
  index: number;
  isFirst?: boolean;
}

/**
 * Maps known service slugs/titles to high-intent detail routes.
 * If no dedicated detail route exists, returns null.
 */
export const getServiceDetailRoute = (service: SiteServiceItem): string | null => {
  const route = getServiceDedicatedRoute(service);
  return route && route !== '/services' ? route : null;
};

// Neutral placeholder SVG data URI for services without a photograph
const NEUTRAL_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20fill%3D%22%23e2e8f0%22%20width%3D%22800%22%20height%3D%22450%22%2F%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22600%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EDigiHust%20Service%3C%2Ftext%3E%3C%2Fsvg%3E";

export const ServiceFeatureRow: React.FC<ServiceFeatureRowProps> = ({
  service,
  index,
  isFirst = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLElement>(null);

  // Row 1 (index 0) = Text left, Image right (odd row)
  // Row 2 (index 1) = Image left, Text right (even row)
  const isImageRight = index % 2 === 0;

  // IntersectionObserver for one-time fade in (threshold 0.2)
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
      { threshold: 0.2 }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  const slug = service.slug || service.id || `service-${index + 1}`;
  const headingId = `heading-${slug}`;
  const detailRoute = getServiceDetailRoute(service);

  // Bullets: use 3-5 existing features/tags (max 5)
  const rawBullets: string[] = service.features || (service as { tags?: string[] }).tags || [];
  const bullets = rawBullets.slice(0, 5);

  // Image resolution: image-right is 16/9, image-left is 16/10
  const imageAspectClass = isImageRight ? 'aspect-[16/9]' : 'aspect-[16/10]';
  const imgWidth = 800;
  const imgHeight = isImageRight ? 450 : 500;
  const placeholderSrc = isImageRight
    ? "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20450%22%3E%3Crect%20fill%3D%22%23e2e8f0%22%20width%3D%22800%22%20height%3D%22450%22%2F%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2222%22%20font-weight%3D%22600%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EDigiHust%20Service%3C%2Ftext%3E%3C%2Fsvg%3E"
    : "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22500%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20500%22%3E%3Crect%20fill%3D%22%23e2e8f0%22%20width%3D%22800%22%20height%3D%22500%22%2F%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2222%22%20font-weight%3D%22600%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EDigiHust%20Service%3C%2Ftext%3E%3C%2Fsvg%3E";

  const imageSrc = service.imageUrl && service.imageUrl.trim() !== '' ? service.imageUrl : placeholderSrc;

  // Description: full existing description
  const description =
    service.description ||
    service.shortDescription ||
    service.tagline ||
    '';

  // Motion styling (transform & opacity only, 80ms offset)
  const textMotionStyle: React.CSSProperties = shouldReduceMotion
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(16px)',
        transition: 'opacity 350ms ease-out, transform 350ms ease-out',
      };

  const imageMotionStyle: React.CSSProperties = shouldReduceMotion
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0px)' : 'translateY(16px)',
        transition: 'opacity 350ms ease-out 80ms, transform 350ms ease-out 80ms',
      };

  return (
    <section
      ref={rowRef}
      id={slug}
      aria-labelledby={headingId}
      className="scroll-mt-[88px] w-full"
    >
      {/* ── ROW WRAPPER ── */}
      {/* Below 768px: single column with image always first. 768px+: 2 columns alternating */}
      <div
        className={`flex flex-col md:flex-row md:items-start ${
          isImageRight
            ? 'md:gap-[5%] lg:gap-[5%]'
            : 'md:gap-[6.5%] lg:gap-[6.5%]'
        }`}
      >
        {/* ── TEXT BLOCK ── */}
        <div
          style={textMotionStyle}
          className={`w-full ${
            isImageRight
              ? 'order-2 md:order-1 md:w-[38%] lg:w-[38%]'
              : 'order-2 md:order-2 md:w-[40%] lg:w-[40%] md:mr-[4.5%] lg:mr-[4.5%]'
          } shrink-0 mt-6 md:mt-0`}
        >
          {/* 1. Accent Bar: 44px wide by 3px tall, brand teal, directly above heading */}
          <div
            className="w-[44px] h-[3px] bg-[var(--brand-teal)] dark:bg-cyan-400 mb-[14px]"
            aria-hidden="true"
          />

          {/* 2. Heading (h2): Outfit 700, 34px (desktop), leading 1.12, letter-spacing -0.01em, max-width 11em */}
          <h2
            id={headingId}
            style={{ textWrap: 'balance' }}
            className="font-display font-bold text-[28px] md:text-[30px] lg:text-[34px] leading-[1.12] tracking-[-0.01em] text-[var(--text-heading)] max-w-[11em] mb-[12px]"
          >
            {service.title}
          </h2>

          {/* 3. Paragraph: Plus Jakarta Sans 400, 16px (desktop), leading 1.5, max-width 22rem */}
          <p className="font-sans font-normal text-[15px] lg:text-[16px] leading-[1.5] text-[var(--text-muted)] max-w-[22rem] mb-[20px]">
            {description}
          </p>

          {/* 4. Bullet List (ul): 14px, leading 1.45, 6px gap, 6px filled teal circle */}
          {bullets.length > 0 && (
            <ul className="space-y-[6px]">
              {bullets.map((bullet: string, bIdx: number) => (
                <li
                  key={bIdx}
                  className="flex items-start gap-[14px] text-[14px] leading-[1.45] text-[var(--text-body)]"
                >
                  <span
                    className="w-[6px] h-[6px] rounded-full bg-[var(--brand-teal)] dark:bg-cyan-400 shrink-0 mt-[7px]"
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {/* 5. Optional Link: Only rendered if service has a detail route */}
          {detailRoute && (
            <div>
              <Link
                to={detailRoute}
                className="inline-flex items-center text-[14px] font-semibold text-[var(--brand-teal)] dark:text-cyan-400 mt-[16px] hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] focus-visible:ring-offset-2 rounded-xs transition-colors"
              >
                Explore service →
              </Link>
            </div>
          )}
        </div>

        {/* ── IMAGE BLOCK ── */}
        <div
          style={imageMotionStyle}
          className={`w-full ${
            isImageRight
              ? 'order-1 md:order-2 md:w-[57%] lg:w-[57%]'
              : 'order-1 md:order-1 md:w-[49%] lg:w-[49%]'
          } shrink-0`}
        >
          <img
            src={imageSrc}
            alt={service.title}
            width={imgWidth}
            height={imgHeight}
            loading={isFirst ? 'eager' : 'lazy'}
            decoding="async"
            {...(isFirst ? { fetchPriority: 'high' } : { fetchPriority: 'auto' })}
            className={`w-full ${imageAspectClass} object-cover rounded-none shadow-none border-0 block`}
          />
        </div>
      </div>
    </section>
  );
};
