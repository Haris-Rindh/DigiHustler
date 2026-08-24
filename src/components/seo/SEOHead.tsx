import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'service';
  ogImage?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_TITLE = 'DigiHust — Digital Services Handled by Specialized Talent';
const DEFAULT_DESC = 'DigiHust delivers web development, design, AI & automation, digital marketing, and cybersecurity through verified specialized teams under one professional brand.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
const SITE_URL = 'https://digihust.com';

export const SEOHead: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = 'digital agency, web development, graphic design, AI automation, cybersecurity, digital marketing, Pakistan Digiskill talent, bespoke software',
  canonical = SITE_URL,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  schema,
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title.includes('DigiHust') ? title : `${title} | DigiHust`;

    // 2. Helper to set or create meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Standard Metas
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', 'DigiHust Management Team');

    // OpenGraph Metas
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:url', canonical, true);
    setMetaTag('og:site_name', 'DigiHust', true);

    // Twitter Card Metas
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Structured Data (JSON-LD)
    const existingSchema = document.getElementById('seo-jsonld');
    if (existingSchema) {
      existingSchema.remove();
    }

    const defaultOrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'DigiHust',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      image: ogImage,
      description: description,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'PK',
      },
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
      sameAs: [
        'https://linkedin.com/company/digihust',
        'https://github.com/Haris-Rindh/DigiHustler',
      ],
    };

    const script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema || defaultOrganizationSchema);
    document.head.appendChild(script);

    return () => {
      // Clean up script on unmount
      const s = document.getElementById('seo-jsonld');
      if (s) s.remove();
    };
  }, [title, description, keywords, canonical, ogType, ogImage, schema]);

  return null;
};
