import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Calendar, Tag } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';

export interface BlogPostItem {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  image: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPostItem[] = [
  {
    slug: 'how-to-architect-nextjs-for-ai-crawlers',
    category: 'Engineering & SEO',
    title: 'Architecting Modern Web Apps for AI Search Engines & LLM Crawlers',
    excerpt: 'Why traditional client-side SPAs fail against non-JS AI agents (GPTBot, ClaudeBot, Perplexity), and how static pre-rendering bridges the semantic gap.',
    readTime: '6 min read',
    date: 'Aug 24, 2026',
    author: 'Zubair Ahmed',
    authorRole: 'Lead Full-Stack Architect',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'AI Crawlers', 'Technical SEO', 'Architecture'],
  },
  {
    slug: 'demystifying-ai-automations-n8n-vs-custom-python',
    category: 'AI & Automation',
    title: 'Automating Business Workflows: n8n vs. Custom Python LLM Microservices',
    excerpt: 'A pragmatic framework for deciding when to use visual workflow tools versus specialized Python function-calling pipelines for enterprise operations.',
    readTime: '8 min read',
    date: 'Aug 22, 2026',
    author: 'Dr. Hamza Ali',
    authorRole: 'Head of AI & Data Intelligence',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80',
    tags: ['AI Workflows', 'Python', 'n8n', 'LLMs'],
  },
  {
    slug: 'owasp-top-10-web-security-checklist-for-startups',
    category: 'Cybersecurity',
    title: 'The Essential OWASP Web Application Security & Hardening Checklist',
    excerpt: 'Protecting your digital infrastructure against injection, broken access controls, and data exposure before production deployment.',
    readTime: '7 min read',
    date: 'Aug 19, 2026',
    author: 'Usman Tariq',
    authorRole: 'Security & Cloud Engineer',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    tags: ['Cybersecurity', 'OWASP', 'Penetration Testing', 'Cloud'],
  },
];

export const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Engineering & SEO', 'AI & Automation', 'Cybersecurity'];

  const filteredPosts = activeCategory === 'All'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === activeCategory);

  return (
    <div className="pt-16">
      <SEOHead
        title="Knowledge Base & Technical Insights — DigiHust"
        description="Actionable technical articles and engineering deep dives on Web Architecture, Technical SEO, AI Automation, and Cybersecurity by DigiHust specialists."
        canonical="https://digihust.com/blog"
      />

      {/* Header Banner */}
      <section className="bg-[var(--color-bg)] py-20 px-6 lg:px-8 border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-extrabold text-[var(--color-accent)] uppercase tracking-widest mb-3">
              Engineering & Digital Strategy
            </p>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-5">
              Insights & Knowledge Hub.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              Technical guides, architectural blueprints, and digital growth strategies authored directly by our domain leads.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[var(--color-accent-fill)] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-white py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                data-cursor="view"
                className="group border border-gray-200/80 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:border-[var(--color-accent)]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video overflow-hidden bg-gray-100 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[var(--color-bg)]/90 backdrop-blur-sm text-[10px] font-bold text-[var(--color-text-primary)] border border-[var(--color-border)]">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-xl text-gray-900 mb-3 group-hover:text-[var(--color-accent)] transition-colors leading-tight">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold text-gray-900">{post.author}</p>
                    <p className="text-[10px] text-gray-500">{post.authorRole}</p>
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-[var(--color-accent)] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
