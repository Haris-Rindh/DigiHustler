import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, ArrowRight, CheckCircle2, Tag, User } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { BLOG_POSTS } from './Blog';
import { useApp } from '../../context/AppContext';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { siteContent } = useApp();

  const dynamicPost = (siteContent?.blogPosts || []).find((p) => p.slug === slug);
  const staticPost = BLOG_POSTS.find((p) => p.slug === slug);

  const post = dynamicPost
    ? {
        slug: dynamicPost.slug,
        title: dynamicPost.title,
        excerpt: dynamicPost.excerpt,
        content: dynamicPost.content,
        category: dynamicPost.category,
        readTime: dynamicPost.readTime,
        date: dynamicPost.publishedAt
          ? new Date(dynamicPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'August 2026',
        author: dynamicPost.author,
        authorRole: 'Domain Specialist & Lead',
        image: dynamicPost.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        tags: dynamicPost.tags || ['Engineering', 'Digital Strategy', 'DigiHust'],
      }
    : staticPost
    ? {
        ...staticPost,
        authorRole: 'Managing Lead & Architect',
        tags: ['Web Engineering', 'SEO', 'AI Crawlers', 'Next.js', 'Vite'],
        content: '',
      }
    : {
        slug: 'post-not-found',
        title: 'Architecting Modern Web Apps for AI Search Engines & LLM Crawlers',
        excerpt: 'Why traditional client-side SPAs fail against non-JS AI search engines (GPTBot, ClaudeBot, Perplexity), and how static pre-rendering bridges the semantic discovery gap.',
        content: '',
        category: 'Engineering',
        readTime: '6 min read',
        date: 'August 24, 2026',
        author: 'Haris Asad',
        authorRole: 'Managing Lead & Architect',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        tags: ['Web Engineering', 'SEO', 'AI Crawlers', 'Next.js', 'Vite'],
      };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-[var(--bg-page)] text-[var(--text-body)]">
      <SEOHead
        title={`${post.title} — DigiHust Insights`}
        description={post.excerpt}
      />

      {/* Hero Header */}
      <section className="bg-[var(--bg-subtle)] py-16 sm:py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[var(--brand-teal)] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Insights Hub</span>
          </Link>

          <span className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest block mb-2">
            {post.category}
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--text-heading)] mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-body)]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-teal)] flex items-center justify-center font-bold text-white text-xs">
                {post.author[0]}
              </div>
              <div>
                <p className="font-bold text-[var(--text-heading)]">{post.author}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{post.authorRole || 'Domain Specialist'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                <span>{post.date}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--brand-teal)]" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="bg-[var(--bg-page)] py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-[var(--text-body)] leading-relaxed text-base sm:text-lg">
          <div className="aspect-video rounded-3xl overflow-hidden mb-10 border border-[var(--border-subtle)] shadow-xl bg-[var(--bg-subtle)]">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <p className="text-xl font-medium text-[var(--text-heading)] leading-relaxed border-l-4 border-[var(--brand-teal)] pl-6 italic bg-[var(--bg-surface)] py-4 rounded-r-2xl border border-y-[var(--border-subtle)] border-r-[var(--border-subtle)]">
            "{post.excerpt}"
          </p>

          {post.content ? (
            <div className="space-y-6 text-[var(--text-body)]">
              {post.content.split('\n\n').map((block, idx) => {
                if (block.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-heading)] pt-4">
                      {block.replace('### ', '')}
                    </h3>
                  );
                }
                if (block.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] pt-6">
                      {block.replace('## ', '')}
                    </h2>
                  );
                }
                if (block.startsWith('- ')) {
                  const items = block.split('\n').filter(Boolean);
                  return (
                    <ul key={idx} className="space-y-2 pl-4 list-disc text-sm sm:text-base">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item.replace(/^[-\*]\s+/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="leading-relaxed">
                    {block}
                  </p>
                );
              })}
            </div>
          ) : (
            <>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] pt-6">
                1. The Evolution of Search & AI Bot Crawlers
              </h2>
              <p className="text-[var(--text-body)]">
                Search engines are undergoing their largest shift in two decades. Traditional search engine indexers like Googlebot are increasingly supplemented by automated LLM retrieval spiders (such as OpenAI's GPTBot, Anthropic's ClaudeBot, and PerplexityBot).
              </p>
              <p className="text-[var(--text-body)]">
                Unlike classical desktop browsers, many AI scrapers fetch raw responses without executing client-side JavaScript. This means standard single-page applications (SPAs) serving bare root nodes are invisible to semantic AI citations unless pre-rendered at build time.
              </p>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--text-heading)] pt-6">
                2. Key Architectural Takeaways for Teams
              </h2>
              <div className="space-y-4 pt-2">
                {[
                  'Pre-render all public marketing, case study, and documentation routes into valid static HTML at build time.',
                  'Provide an explicit /llms.txt file declaring corporate capabilities, squad structures, and indexable endpoints.',
                  'Embed structured Schema.org JSON-LD (ProfessionalService, FAQPage, Article) for maximum search engine precision.',
                  'Maintain strict Web Content Accessibility Guidelines (WCAG) to ensure both humans and AI parsers navigate with zero ambiguity.',
                ].map((point) => (
                  <div key={point} className="flex items-start space-x-3 p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                    <CheckCircle2 className="w-5 h-5 text-[var(--brand-teal)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-[var(--text-heading)] font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Tags */}
          <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] text-[var(--text-heading)] font-semibold border border-[var(--border-subtle)]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Bottom CTA */}
      <section className="bg-[var(--bg-subtle)] py-16 px-6 lg:px-8 text-center border-t border-[var(--border-subtle)]">
        <h2 className="font-display font-extrabold text-3xl text-[var(--text-heading)] mb-4">
          Want Custom Engineering for Your Business?
        </h2>
        <p className="text-[var(--text-body)] mb-8 max-w-md mx-auto">
          Our specialized squads build bespoke web architectures, AI automations, and growth systems.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white font-bold shadow-lg transition-all"
        >
          <span>Get a Scoped Proposal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
