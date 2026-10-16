import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHead } from '../seo/SEOHead';
import { useApp } from '../../context/AppContext';
import { formatImageUrl, handleImageError } from '../../lib/imageUrlHelper';

export interface BlogPostItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
}

export const BLOG_POSTS: BlogPostItem[] = [
  {
    slug: 'how-to-architect-nextjs-for-ai-crawlers',
    title: 'Architecting Modern Web Apps for AI Search Engines & LLM Crawlers',
    excerpt: 'Why traditional client-side SPAs fail against non-JS AI search engines (GPTBot, ClaudeBot, Perplexity), and how static pre-rendering bridges the semantic discovery gap.',
    category: 'Engineering',
    readTime: '6 min read',
    date: 'August 24, 2026',
    author: 'Haris Asad',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'demystifying-ai-automations-n8n-vs-custom-python',
    title: 'Automating Business Workflows: n8n vs. Custom Python LLM Microservices',
    excerpt: 'A pragmatic framework for deciding when to use visual workflow tools versus specialized Python function-calling pipelines for enterprise operations.',
    category: 'AI & Automations',
    readTime: '8 min read',
    date: 'August 18, 2026',
    author: 'AI Engineering Lead',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'owasp-top-10-web-security-checklist-for-startups',
    title: 'The Essential OWASP Web Application Security & Hardening Checklist',
    excerpt: 'Protecting your digital infrastructure against injection, broken access controls, and data exposure before production deployment.',
    category: 'Cybersecurity',
    readTime: '7 min read',
    date: 'August 10, 2026',
    author: 'Cybersecurity Lead',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  },
];

export const formatAuthor = (rawAuthor?: string): string => {
  if (!rawAuthor || rawAuthor.trim() === '') return 'DigiHust Editorial';
  const trimmed = rawAuthor.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('lead') ||
    lower.includes('specialist') ||
    lower.includes('architect') ||
    lower.includes('engineer') ||
    lower.includes('director') ||
    lower.includes('editorial')
  ) {
    return 'DigiHust Editorial';
  }
  return `by ${trimmed}`;
};

export const Blog: React.FC = () => {
  const { siteContent } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  // Merge CMS dynamic blog posts with defaults
  const dynamicPosts: BlogPostItem[] = (siteContent?.blogPosts || []).map((bp) => ({
    slug: bp.slug,
    title: bp.title,
    excerpt: bp.excerpt,
    category: bp.category,
    readTime: bp.readTime,
    date: bp.publishedAt ? new Date(bp.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'August 2026',
    author: bp.author,
    image: formatImageUrl(bp.imageUrl, bp.category),
  }));

  const allPosts = dynamicPosts.length > 0 ? dynamicPosts : BLOG_POSTS;

  const categories = ['All', ...Array.from(new Set(allPosts.map((p) => p.category)))];

  const filteredPosts =
    activeCategory === 'All'
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title="Knowledge Hub & Technical Insights | DigiHust"
        description="Explore technical architecture guides, AI automation workflows, and cybersecurity benchmarks written by DigiHust domain specialists."
      />

      {/* Header Banner */}
      <section data-hero="true" className="bg-[var(--bg-subtle)] py-16 sm:py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              Engineering & Digital Strategy
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] mb-5">
              Insights & Knowledge Hub.
            </h1>
            <p className="text-lg text-[var(--text-body)] max-w-2xl leading-relaxed">
              Technical guides, architectural blueprints, and digital growth strategies authored directly by our domain leads.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[var(--brand-teal)] text-white shadow-md'
                    : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-[var(--bg-page)] py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] hover:border-[var(--brand-teal)] shadow-sm hover:shadow-lg"
              >
                <img
                  src={formatImageUrl(post.image, post.category)}
                  alt={post.title}
                  width={800}
                  height={450}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, undefined, post.category)}
                  className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="p-4 pt-3">
                  <h3 className="line-clamp-2 min-h-[2.75rem] font-display text-base font-semibold leading-snug text-[var(--text-heading)] group-hover:text-[var(--brand-teal)] transition-colors mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] min-h-[1.25rem] font-sans flex items-center">
                    {formatAuthor(post.author)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
