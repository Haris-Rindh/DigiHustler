import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Share2, Tag, CheckCircle2 } from 'lucide-react';
import { SEOHead } from '../seo/SEOHead';
import { BLOG_POSTS } from './Blog';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: '2026-08-20',
    dateModified: '2026-08-25',
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      name: 'DigiHust',
      logo: {
        '@type': 'ImageObject',
        url: 'https://digihust.com/favicon.svg',
      },
    },
  };

  return (
    <div className="pt-16">
      <SEOHead
        title={`${post.title} — DigiHust Insights`}
        description={post.excerpt}
        ogImage={post.image}
        ogType="article"
        canonical={`https://digihust.com/blog/${post.slug}`}
        schema={articleSchema}
      />

      {/* Header Banner */}
      <section className="bg-[#071e26] py-16 sm:py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#bde0fe] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Insights Hub</span>
          </Link>

          <span className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest block mb-2">
            {post.category}
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1e4a5d] text-xs text-slate-300">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#1a7a8c] flex items-center justify-center font-bold text-white text-xs">
                {post.author[0]}
              </div>
              <div>
                <p className="font-bold text-white">{post.author}</p>
                <p className="text-[10px] text-[#bde0fe]">{post.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="bg-white py-16 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-gray-800 leading-relaxed text-base sm:text-lg">
          <div className="aspect-video rounded-3xl overflow-hidden mb-10 border border-gray-100 shadow-xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <p className="text-xl font-medium text-gray-900 leading-relaxed border-l-4 border-[#1a7a8c] pl-6 italic bg-gray-50/50 py-3 rounded-r-2xl">
            "{post.excerpt}"
          </p>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 pt-6">
            1. The Evolution of Search & AI Bot Crawlers
          </h2>
          <p className="text-gray-700">
            Search engines are undergoing their largest shift in two decades. Traditional search engine indexers like Googlebot are increasingly supplemented by automated LLM retrieval spiders (such as OpenAI's GPTBot, Anthropic's ClaudeBot, and PerplexityBot).
          </p>
          <p className="text-gray-700">
            Unlike classical desktop browsers, many AI scrapers fetch raw responses without executing client-side JavaScript. This means standard single-page applications (SPAs) serving bare root nodes are invisible to semantic AI citations unless pre-rendered at build time.
          </p>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900 pt-6">
            2. Key Architectural Takeaways for Teams
          </h2>
          <div className="space-y-4 pt-2">
            {[
              'Pre-render all public marketing, case study, and documentation routes into valid static HTML at build time.',
              'Provide an explicit /llms.txt file declaring corporate capabilities, squad structures, and indexable endpoints.',
              'Embed structured Schema.org JSON-LD (ProfessionalService, FAQPage, Article) for maximum search engine precision.',
              'Maintain strict Web Content Accessibility Guidelines (WCAG) to ensure both humans and AI parsers navigate with zero ambiguity.',
            ].map((point) => (
              <div key={point} className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <CheckCircle2 className="w-5 h-5 text-[#1a7a8c] flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-700 font-medium">{point}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Bottom CTA */}
      <section className="bg-[#071e26] py-16 px-6 lg:px-8 text-center border-t border-[#1e4a5d]">
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">
          Want Custom Engineering for Your Business?
        </h2>
        <p className="text-slate-300 mb-8 max-w-md mx-auto">
          Our specialized squads build bespoke web architectures, AI automations, and growth systems.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold shadow-lg transition-all"
        >
          <span>Get a Scoped Proposal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
