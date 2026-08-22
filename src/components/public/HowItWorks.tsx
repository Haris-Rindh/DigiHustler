import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    title: 'Tell Us What You Need',
    detail: 'Submit your project through the Get a Quote form. Tell us your idea, problem, or goal. Be as detailed or brief as you like — we will clarify together in our first conversation.',
    points: [
      'What do you want to build or fix?',
      'Who is the audience or end user?',
      'What does success look like?',
      'Do you have existing materials, branding, or code?',
    ],
  },
  {
    num: '02',
    title: 'We Build the Right Team',
    detail: "DigiHust's management team reviews your project brief and identifies which combination of skills it needs. We then assemble a specialized team from our talent network — precisely matched to your project.",
    points: [
      'Single point of contact assigned to you',
      'No irrelevant people on your project',
      'Team selected from verified Digiskill professionals',
      'You\'re briefed on who is working and why',
    ],
  },
  {
    num: '03',
    title: 'We Create',
    detail: 'The team goes to work with clear milestones and deliverables. You receive regular progress updates. Feedback rounds are built in so nothing gets delivered as a surprise.',
    points: [
      'Structured milestones and delivery dates',
      'Shared project workspace and regular check-ins',
      'Revision rounds built in to every scope',
      'Final QA before handover',
    ],
  },
  {
    num: '04',
    title: 'We Deliver',
    detail: "You receive the final deliverables — complete, documented, and production-ready. We don't just hand over files; we walk you through what was built and make sure you can use it confidently.",
    points: [
      'Full file and code handover',
      'Delivery documentation and usage notes',
      'Post-delivery support window',
      'Option for ongoing retainer if needed',
    ],
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <div className="pt-16">

      {/* Header */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 border-b border-[#1e4a5d]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-extrabold text-[#1a7a8c] uppercase tracking-widest mb-4">The Process</p>
          <h1 className="font-display font-extrabold text-5xl text-white mb-5">How DigiHust Works</h1>
          <p className="text-lg text-slate-300 max-w-xl">
            A simple, professional process from your first message to your final delivered product.
          </p>
        </div>
      </div>

      {/* Model Explainer Banner */}
      <div className="bg-[#0d2833] border-b border-[#1e4a5d] py-10 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {['CLIENT', 'DIGIHUST', 'SPECIALIST TEAM', 'DELIVERED SOLUTION'].map((label, i) => (
              <React.Fragment key={label}>
                <div className={`text-center px-6 py-4 rounded-xl border ${i === 1 ? 'border-[#1a7a8c] bg-[#1a7a8c]/20' : 'border-[#1e4a5d] bg-[#071e26]'}`}>
                  <p className={`text-sm font-extrabold uppercase tracking-widest ${i === 1 ? 'text-[#bde0fe]' : 'text-slate-300'}`}>{label}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block">
                    <ArrowRight className="w-5 h-5 text-[#1a7a8c]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-6 max-w-xl mx-auto">
            Instead of managing multiple freelancers directly, you work with DigiHust as one professional entity. We handle the team, the workflow, and the delivery.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-0">
          {STEPS.map((step, i) => (
            <div key={step.num} className={`flex flex-col lg:flex-row gap-0 items-stretch ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>

              {/* Number Column */}
              <div className={`lg:w-1/3 flex flex-col items-center justify-center py-16 px-8 ${i % 2 === 0 ? 'bg-[#071e26]' : 'bg-[#0d2833]'}`}>
                <div className="text-7xl lg:text-9xl font-display font-extrabold text-[#1e4a5d] leading-none mb-4 select-none">{step.num}</div>
                <h2 className="font-display font-extrabold text-2xl text-white text-center">{step.title}</h2>
              </div>

              {/* Detail Column */}
              <div className="lg:w-2/3 py-16 px-8 lg:px-12 bg-white border-l border-gray-100">
                <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-lg">{step.detail}</p>
                <ul className="space-y-3">
                  {step.points.map(pt => (
                    <li key={pt} className="flex items-start space-x-3">
                      <span className="w-5 h-5 rounded-full bg-[#1a7a8c]/10 border border-[#1a7a8c]/30 text-[#1a7a8c] flex items-center justify-center text-[10px] font-black mt-0.5">✓</span>
                      <span className="text-sm text-gray-700">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 py-20 px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-extrabold text-3xl text-gray-900 mb-10 text-center">Common Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Do you work with small businesses and startups?',
                a: 'Yes. We work with businesses of every size — from solo founders launching their first product to established companies that need ongoing digital support.',
              },
              {
                q: 'How long does a project typically take?',
                a: 'It depends on scope. Simple websites typically take 1–3 weeks. Complex apps, branding systems, or multi-channel campaigns may take 4–12 weeks. We\'ll give you a timeline estimate before any work begins.',
              },
              {
                q: 'What information do I need to provide?',
                a: 'As much or as little as you have. If you have a detailed spec, great. If you have a rough idea on a napkin, that\'s fine too. Our intake call will help clarify everything.',
              },
              {
                q: 'Can I get a quote before committing?',
                a: 'Absolutely. Use our Get a Quote form and we\'ll come back to you within 24 hours with a detailed scope and pricing estimate. No commitment required.',
              },
            ].map(faq => (
              <div key={faq.q} className="bg-white rounded-xl border border-gray-200 p-6">
                <p className="font-bold text-gray-900 mb-2">{faq.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#071e26] py-20 px-6 lg:px-8 text-center border-t border-[#1e4a5d]">
        <h2 className="font-display font-extrabold text-3xl text-white mb-4">Ready to start?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">Tell us what you need. We'll take it from there.</p>
        <Link to="/contact"
          className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#1a7a8c] hover:bg-[#156575] text-white font-bold shadow-lg transition-all">
          <span>Get a Quote</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
