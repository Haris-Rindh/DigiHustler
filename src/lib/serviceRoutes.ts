/**
 * Centralized service and capability route resolver for DigiHust.
 * Maps services, capability names, slugs, and keywords to their dedicated landing pages.
 */

export interface ServiceIdentifier {
  title?: string;
  slug?: string;
  id?: string;
  linkTarget?: string;
}

/**
 * Returns the dedicated landing page route for a given service or capability.
 * Never redirects to a generic /contact form or unanchored page when a dedicated page exists.
 */
export const getServiceDedicatedRoute = (
  serviceOrTitle?: string | ServiceIdentifier | null
): string => {
  if (!serviceOrTitle) return '/services';

  if (typeof serviceOrTitle === 'string') {
    const s = serviceOrTitle.trim().toLowerCase();
    if (s.startsWith('/services/') && s !== '/services') {
      return serviceOrTitle;
    }
    return mapKeywordsToDedicatedRoute(s);
  }

  // If linkTarget already points to a dedicated service landing page, preserve it
  if (
    serviceOrTitle.linkTarget &&
    serviceOrTitle.linkTarget.startsWith('/services/') &&
    serviceOrTitle.linkTarget !== '/services' &&
    serviceOrTitle.linkTarget !== '/services/'
  ) {
    return serviceOrTitle.linkTarget;
  }

  const combined = `${serviceOrTitle.slug || ''} ${serviceOrTitle.title || ''} ${serviceOrTitle.id || ''}`.toLowerCase();
  return mapKeywordsToDedicatedRoute(combined);
};

const mapKeywordsToDedicatedRoute = (text: string): string => {
  // 1. Web & Mobile Engineering / SaaS Development
  if (
    text.includes('saas') ||
    text.includes('web') ||
    text.includes('engineering') ||
    text.includes('development') ||
    text.includes('dev') ||
    text.includes('full-stack') ||
    text.includes('app')
  ) {
    return '/services/saas-mvp-development';
  }

  // 2. Creative & UI/UX Design Systems & Brand Identity
  if (
    text.includes('brand') ||
    text.includes('design') ||
    text.includes('creative') ||
    text.includes('ui') ||
    text.includes('ux') ||
    text.includes('graphic') ||
    text.includes('video') ||
    text.includes('motion')
  ) {
    return '/services/brand-identity-design-system';
  }

  // 3. AI & Workflow Automation
  if (
    text.includes('ai') ||
    text.includes('automation') ||
    text.includes('workflow') ||
    text.includes('llm') ||
    text.includes('bot') ||
    text.includes('agent')
  ) {
    return '/services/ai-workflow-automation';
  }

  // 4. Digital Marketing & SEO
  if (
    text.includes('market') ||
    text.includes('seo') ||
    text.includes('growth') ||
    text.includes('ads') ||
    text.includes('ppc') ||
    text.includes('campaign')
  ) {
    return '/services/digital-marketing-seo';
  }

  // 5. Cybersecurity & Auditing
  if (
    text.includes('cyber') ||
    text.includes('security') ||
    text.includes('audit') ||
    text.includes('pen test') ||
    text.includes('pentest') ||
    text.includes('hardening') ||
    text.includes('owasp')
  ) {
    return '/services/cybersecurity-audit';
  }

  // 6. Data Intelligence & Analytics
  if (
    text.includes('data') ||
    text.includes('bi') ||
    text.includes('intelligence') ||
    text.includes('analytic') ||
    text.includes('powerbi') ||
    text.includes('etl') ||
    text.includes('pipeline') ||
    text.includes('dashboard')
  ) {
    return '/services/data-intelligence-analytics';
  }

  return '/services';
};

/**
 * Standard Capabilities list for Navigation & Footer links
 */
export const CAPABILITIES_NAV_ITEMS = [
  { name: 'Web Development', href: '/services/saas-mvp-development' },
  { name: 'Creative & UI/UX', href: '/services/brand-identity-design-system' },
  { name: 'AI & Automation', href: '/services/ai-workflow-automation' },
  { name: 'Digital Marketing', href: '/services/digital-marketing-seo' },
  { name: 'Cybersecurity', href: '/services/cybersecurity-audit' },
  { name: 'Data Intelligence', href: '/services/data-intelligence-analytics' },
];
