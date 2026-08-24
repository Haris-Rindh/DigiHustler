import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Palette, Cpu, TrendingUp, Shield, Database, ChevronRight } from 'lucide-react';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import { Card } from '@/components/ui/card';


// ── Service categories ──────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Development',
    summary: 'Websites · Web Apps · Frontend · Backend',
    description: 'From landing pages to full-stack web applications, we build digital products that are fast, scalable, and maintainable.',
    tags: ['React', 'Node.js', 'Next.js', 'Mobile Apps'],
    color: '#1a7a8c',
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Creative',
    summary: 'Graphic Design · UI/UX · Branding · Social Media',
    description: 'We design visual identities, interfaces, and content that make your brand memorable and your product intuitive.',
    tags: ['Brand Identity', 'UI/UX', 'Figma', 'Motion'],
    color: '#8b5cf6',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'AI & Automation',
    summary: 'AI Solutions · Chatbots · Automation · AI Integration',
    description: 'We integrate AI tools, automate repetitive workflows, and build intelligent systems that save your team time and money.',
    tags: ['OpenAI', 'Python', 'n8n', 'Zapier'],
    color: '#0ea5e9',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Marketing',
    summary: 'Social Media · Content · SEO · Digital Marketing',
    description: 'We grow your online presence through targeted digital marketing strategies, content creation, and search optimization.',
    tags: ['SEO', 'PPC', 'Social Media', 'Email'],
    color: '#f59e0b',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Cybersecurity',
    summary: 'Security Assessment · Web Security · Solutions',
    description: 'We protect your digital assets through security audits, vulnerability assessments, and security implementation.',
    tags: ['Penetration Testing', 'Audit', 'Compliance'],
    color: '#ef4444',
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Digital Solutions',
    summary: 'Data · Virtual Assistance · Specialized Services',
    description: 'From data analytics and business intelligence to virtual assistance — we handle the digital work your business needs.',
    tags: ['PowerBI', 'Data Analysis', 'VA', 'BI'],
    color: '#10b981',
  },
];

// ── Process steps ───────────────────────────────────────────────────────────
const STEPS = [
  {
    num: '01',
    title: 'Tell Us What You Need',
    desc: 'Submit your project requirements through our intake form. Be as detailed or as brief as you like — we will clarify everything together.',
  },
  {
    num: '02',
    title: 'We Build the Right Team',
    desc: 'DigiHust identifies the appropriate skills and assembles a team of specialized people matched precisely to your project.',
  },
  {
    num: '03',
    title: 'We Create',
    desc: 'Our team works on your project with clear milestones, regular updates, and full transparency throughout the process.',
  },
  {
    num: '04',
    title: 'We Deliver',
    desc: 'You receive the finished solution, full files, documentation, and continued support after handover.',
  },
];

// ── Portfolio previews ──────────────────────────────────────────────────────
const WORK_PREVIEWS = [
  {
    category: 'Web Development',
    title: 'Real-Estate Marketplace Portal',
    tags: ['React', 'Node.js', 'Tailwind'],
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Creative & Branding',
    title: 'Automotive Brand Identity & Motion Ads',
    tags: ['Brand Identity', 'Motion Graphics', '3D'],
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'AI & Automation',
    title: 'Executive Sales BI Dashboard',
    tags: ['PowerBI', 'Python', 'SQL'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
  },
];

// ── Team previews ───────────────────────────────────────────────────────────
const TEAM_PREVIEWS = [
  {
    name: 'Zubair Ahmed',
    role: 'Lead Architect',
    tags: ['Full Stack', 'React', 'Node.js', 'DevOps'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Ayesha Khan',
    role: 'Creative Director',
    tags: ['UI/UX', 'Figma', 'Motion Graphics'],
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Dr. Hamza Ali',
    role: 'Head of AI & Data',
    tags: ['ML', 'Python', 'PowerBI', 'LLM'],
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
  },
  {
    name: 'Bilal Farooq',
    role: 'Growth & Outreach Lead',
    tags: ['B2B Sales', 'Cold Email', 'Digital Marketing'],
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
  },
];

export const Home: React.FC = () => {
  return (
    <div className="pt-16">

      {/* ── SECTION 1: HERO ── */}
      <section className="bg-[#071e26] min-h-[92vh] flex items-center px-4 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto w-full">
          <Card className="w-full h-[580px] lg:h-[620px] bg-[#071e26] border border-[#1e4a5d] relative overflow-hidden rounded-2xl">

            <Spotlight
              className="left-1/4 -top-20"
              size={400}
            />

            <div className="flex flex-col lg:flex-row h-full">

              {/* ── Left: Text content ── */}
              <div className="flex-1 p-8 lg:p-12 relative z-10 flex flex-col justify-center">

                {/* Label */}
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#1e4a5d] text-[#bde0fe] text-xs font-semibold uppercase tracking-wider mb-7 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a8c] animate-pulse" />
                  <span>Pakistan&apos;s Specialist Digital Team</span>
                </div>

                {/* Headline */}
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mb-5">
                  Your Digital Work.<br />
                  <span className="text-[#bde0fe]">Handled by Skilled People.</span>
                </h1>

                {/* Sub */}
                <p className="text-base text-slate-300 max-w-md leading-relaxed mb-8">
                  From websites and design to AI, marketing, and cybersecurity — DigiHust brings the right digital talent together to get your project done.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10">
                  <Link to="/contact"
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold text-sm shadow-lg transition-all">
                    <span>Get a Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/services"
                    className="flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-[#1e4a5d] hover:border-[#1a7a8c] text-slate-200 font-bold text-sm transition-all hover:bg-[#1a7a8c]/10">
                    <span>Explore Services</span>
                  </Link>
                </div>

                {/* Tag strip */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                  {['Web Dev', 'Design', 'AI', 'Marketing', 'Cybersecurity'].map((t, i) => (
                    <React.Fragment key={t}>
                      {i > 0 && <span className="text-[#1e4a5d] hidden sm:inline">·</span>}
                      <span>{t}</span>
                    </React.Fragment>
                  ))}
                </div>

              </div>

              {/* ── Right: Interactive 3D Scene ── */}
              <div className="flex-1 relative hidden lg:block">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>

            </div>
          </Card>
        </div>
      </section>

      {/* ── SECTION 2: SERVICES OVERVIEW ── */}
      <section className="bg-white py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-14">
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-4">One Company. Every Digital Need.</h2>
            <p className="text-base text-gray-500 max-w-xl">
              Instead of hunting five different freelancers, you come to DigiHust. We handle the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(svc => (
              <div key={svc.title}
                className="group border border-gray-100 rounded-2xl p-7 hover:border-[#1a7a8c]/30 hover:shadow-lg transition-all cursor-pointer bg-white">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white"
                  style={{ backgroundColor: svc.color }}>
                  {svc.icon}
                </div>
                <h3 className="font-display font-extrabold text-xl text-gray-900 mb-1">{svc.title}</h3>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{svc.summary}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{svc.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {svc.tags.map(t => (
                    <span key={t} className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 border border-gray-100 font-medium">{t}</span>
                  ))}
                </div>
                <Link to="/services" className="inline-flex items-center space-x-1 text-sm font-bold text-[#1a7a8c] group-hover:gap-2 transition-all">
                  <span>Explore</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 3: WHY DIGIHUST ── */}
      <section className="bg-[#071e26] py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div>
              <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">Why DigiHust?</p>
              <h2 className="font-display font-extrabold text-4xl text-white mb-6 leading-tight">
                A professional digital company — not a marketplace of freelancers.
              </h2>
              <p className="text-base text-slate-300 leading-relaxed mb-6">
                The client doesn't have to hunt for five different freelancers, negotiate five different rates, and manage five different timelines.
              </p>
              <p className="text-base text-slate-300 leading-relaxed mb-8">
                They come to DigiHust. We identify what skills the project needs, assemble the right team, and deliver a complete solution under one professional relationship.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  'One point of contact for your entire project',
                  'Specialized talent matched to your exact needs',
                  'Transparent delivery process with real updates',
                  'Work from verified, Digiskill-trained professionals',
                ].map(point => (
                  <div key={point} className="flex items-start space-x-3">
                    <span className="w-5 h-5 rounded-full bg-[#1a7a8c]/20 border border-[#1a7a8c]/40 text-[#bde0fe] flex items-center justify-center text-xs font-black mt-0.5">✓</span>
                    <p className="text-sm text-slate-300">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Model */}
            <div className="flex flex-col items-center gap-0 select-none">
              {/* Client */}
              <div className="w-48 py-3 px-6 rounded-xl bg-white text-gray-900 text-center font-bold text-sm shadow-lg">
                Client
              </div>
              <div className="w-px h-8 bg-[#1e4a5d]" />
              {/* DigiHust */}
              <div className="w-56 py-4 px-6 rounded-xl bg-[#1a7a8c] text-white text-center font-extrabold text-base shadow-xl border border-[#1a7a8c]">
                DigiHust
                <p className="text-[10px] font-normal text-[#bde0fe] mt-0.5">ONE TEAM. ONE CONTACT.</p>
              </div>
              <div className="w-px h-8 bg-[#1e4a5d]" />
              {/* Branches */}
              <div className="grid grid-cols-3 gap-4 w-full">
                {[['Development', '#1a7a8c'], ['Creative', '#8b5cf6'], ['AI & Data', '#0ea5e9']].map(([label, col]) => (
                  <div key={label} className="flex flex-col items-center">
                    <div className="w-px h-6 bg-[#1e4a5d]" />
                    <div className="w-full py-2.5 px-2 rounded-xl border text-center text-xs font-bold"
                      style={{ borderColor: col + '50', color: col, backgroundColor: col + '15' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 w-2/3 mt-4">
                {[['Marketing', '#f59e0b'], ['Cybersecurity', '#ef4444']].map(([label, col]) => (
                  <div key={label} className="flex flex-col items-center">
                    <div className="w-full py-2.5 px-2 rounded-xl border text-center text-xs font-bold"
                      style={{ borderColor: col + '50', color: col, backgroundColor: col + '15' }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-px h-8 bg-[#1e4a5d] mt-4" />
              <div className="w-48 py-3 px-6 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold text-sm">
                Final Delivered Project
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section className="bg-white py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-14 text-center">
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">The Process</p>
            <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-4">How It Works</h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">Four simple steps from your idea to a delivered digital solution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gray-100 z-0" style={{ width: 'calc(100% - 3rem)', left: 'calc(3rem + 1px)' }} />
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#071e26] border-2 border-[#1a7a8c] text-[#bde0fe] font-display font-extrabold text-lg flex items-center justify-center mb-5">
                    {step.num}
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/how-it-works"
              className="inline-flex items-center space-x-2 text-sm font-bold text-[#1a7a8c] hover:underline">
              <span>See the full process</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── SECTION 5: SELECTED WORK ── */}
      <section className="bg-[#071e26] py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">Selected Work</p>
              <h2 className="font-display font-extrabold text-4xl text-white">Our Work</h2>
            </div>
            <Link to="/work"
              className="hidden sm:flex items-center space-x-2 text-sm font-bold text-[#bde0fe] hover:underline">
              <span>View all projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WORK_PREVIEWS.map(project => (
              <div key={project.title}
                className="group border border-[#1e4a5d] rounded-2xl overflow-hidden hover:border-[#1a7a8c]/60 transition-all cursor-pointer">
                <div className="aspect-video overflow-hidden bg-[#0d2833]">
                  <img src={project.img} alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90" />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-bold text-[#1a7a8c] uppercase tracking-wider mb-1">{project.category}</p>
                  <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-[#bde0fe] transition-colors">{project.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#0d2833] text-slate-400 border border-[#1e4a5d]">{t}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-[#bde0fe]">
                    <span>View Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── SECTION 6: MEET THE TALENT ── */}
      <section className="bg-white py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12 text-center">
            <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-3">The People Behind the Work</p>
            <h2 className="font-display font-extrabold text-4xl text-gray-900 mb-4">Meet the Talent</h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Real people with real skills — trained, verified Digiskill professionals who deliver the work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_PREVIEWS.map(member => (
              <div key={member.name} className="group border border-gray-100 rounded-2xl p-6 hover:border-[#1a7a8c]/30 hover:shadow-lg transition-all text-center">
                <img src={member.img} alt={member.name}
                  className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 ring-2 ring-gray-100 group-hover:ring-[#1a7a8c]/30 transition-all" />
                <h3 className="font-bold text-base text-gray-900 mb-0.5">{member.name}</h3>
                <p className="text-xs font-semibold text-[#1a7a8c] mb-3">{member.role}</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {member.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-50 text-gray-500 border border-gray-100">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/team"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl border border-gray-200 hover:border-[#1a7a8c] text-gray-700 hover:text-[#1a7a8c] font-bold text-sm transition-all">
              <span>Meet the full team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── SECTION 7: CTA ── */}
      <section className="bg-[#071e26] py-24 px-6 lg:px-8 border-t border-[#1e4a5d]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
            Have a project in mind?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Tell us what you need. We'll figure out the rest.
          </p>
          <Link to="/contact"
            className="inline-flex items-center space-x-3 px-10 py-5 rounded-2xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-extrabold text-lg shadow-2xl transition-all">
            <span>Start a Project</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};
