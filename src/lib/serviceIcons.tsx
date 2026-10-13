import {
  Terminal,
  Code2,
  Code,
  Layers,
  Palette,
  Cpu,
  Film,
  Clapperboard,
  PenTool,
  TrendingUp,
  Megaphone,
  Search,
  Shield,
  Database,
  Box,
  Brain,
  Workflow,
} from 'lucide-react';

export const AVAILABLE_SERVICE_ICONS = [
  { id: 'terminal', label: 'Terminal / Code (Engineering)' },
  { id: 'code', label: 'Code Bracket (Development)' },
  { id: 'layers', label: 'Layers (UI/UX Systems)' },
  { id: 'palette', label: 'Palette (Brand Design)' },
  { id: 'cpu', label: 'CPU / Brain (AI Engineering)' },
  { id: 'film', label: 'Film / Video (Video Editing)' },
  { id: 'clapperboard', label: 'Clapperboard (Motion Graphics)' },
  { id: 'pen-tool', label: 'Pen Tool (Graphic Design)' },
  { id: 'trending-up', label: 'Trending Up (Growth / SEO)' },
  { id: 'megaphone', label: 'Megaphone (Marketing & Ads)' },
  { id: 'search', label: 'Search (Technical SEO)' },
  { id: 'shield', label: 'Shield (Cybersecurity)' },
  { id: 'database', label: 'Database (Data Intelligence)' },
] as const;

/**
 * Resolves a service icon string key into its respective Lucide icon component.
 * Fallback returns null to avoid injecting unmatched icons.
 */
export const getServiceIcon = (
  iconKey?: string,
  className: string = 'w-5 h-5'
): React.ReactElement | null => {
  const normalized = (iconKey || '').toLowerCase().trim();

  switch (normalized) {
    // 1. Web & Mobile Engineering -> code / terminal style
    case 'terminal':
      return <Terminal className={className} />;
    case 'code':
    case 'code-2':
    case 'code2':
    case 'development':
    case 'web':
      return <Code2 className={className} />;

    // 2. UI/UX & 3D Brand Systems -> palette or layers / cube
    case 'layers':
    case 'cube':
    case 'box':
      return <Layers className={className} />;
    case 'palette':
    case 'design':
    case 'creative':
      return <Palette className={className} />;

    // 3. AI Workflows & Business Intelligence -> brain / cpu / workflow
    case 'brain':
    case 'cpu':
    case 'ai':
    case 'workflow':
      return <Cpu className={className} />;

    // 4. Graphic Design & Video Editing -> clapperboard / film or pen-tool
    case 'film':
    case 'video':
      return <Film className={className} />;
    case 'clapperboard':
      return <Clapperboard className={className} />;
    case 'pen-tool':
    case 'pentool':
    case 'graphics':
      return <PenTool className={className} />;

    // 5. Digital Marketing & SEO -> trending-up / megaphone / search
    case 'trending-up':
    case 'trending':
    case 'growth':
      return <TrendingUp className={className} />;
    case 'megaphone':
    case 'marketing':
      return <Megaphone className={className} />;
    case 'search':
    case 'seo':
      return <Search className={className} />;

    // Additional domains
    case 'shield':
    case 'security':
    case 'cybersecurity':
      return <Shield className={className} />;
    case 'database':
    case 'data':
    case 'bi':
      return <Database className={className} />;

    // Fallback: No icon
    default: {
      return null;
    }
  }
};
