const fs = require('fs');
let content = fs.readFileSync('src/components/public/About.tsx', 'utf8');

const foundersSection = `
      {/* Founders Section */}
      <section className="bg-[var(--bg-subtle)] py-20 px-6 lg:px-8 border-b border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-extrabold text-[var(--brand-teal)] uppercase tracking-widest mb-3">
              Leadership
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text-heading)]">
              The Visionaries Behind DigiHust
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Founder 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-8 relative overflow-hidden group hover:border-[var(--brand-teal)] transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-teal)] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-[var(--brand-teal-subtle)] flex items-center justify-center text-[var(--brand-teal)] font-display font-black text-2xl mb-6">M</div>
              <h3 className="font-display font-black text-2xl text-[var(--text-heading)] mb-1">Mahad Abbas</h3>
              <p className="text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-4">Founder & CEO</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                As the Founder and CEO of DigiHust, Mahad Abbas drives the strategic vision of transforming how enterprises access top-tier digital talent. With a background in scalable web engineering and business operations, Mahad established DigiHust to bridge the gap between brilliant technical specialists and clients needing guaranteed, headache-free digital delivery.
              </p>
            </motion.div>

            {/* Founder 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-8 relative overflow-hidden group hover:border-[var(--brand-teal)] transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-teal)] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
              <div className="w-16 h-16 rounded-2xl bg-[var(--brand-teal-subtle)] flex items-center justify-center text-[var(--brand-teal)] font-display font-black text-2xl mb-6">H</div>
              <h3 className="font-display font-black text-2xl text-[var(--text-heading)] mb-1">Muhammad Haseeb</h3>
              <p className="text-xs font-bold text-[var(--brand-teal)] uppercase tracking-wider mb-4">Co-Founder</p>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                As Co-Founder, Muhammad Haseeb orchestrates the operational excellence and technical architecture that powers DigiHust's specialized squads. His expertise ensures that every AI automation, design system, and cybersecurity protocol executed by the team meets rigorous enterprise standards, delivering flawless digital products every time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

`;

content = content.replace('{/* Core Values (Hustle. Create. Deliver.) */}', foundersSection + '      {/* Core Values (Hustle. Create. Deliver.) */}');
fs.writeFileSync('src/components/public/About.tsx', content);
