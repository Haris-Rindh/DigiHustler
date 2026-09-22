const fs = require('fs');

let content = fs.readFileSync('src/components/portal/SiteContentManager.tsx', 'utf8');

// 1. Add 'careers' to activeTab type
content = content.replace(
  /'hero' \| 'valueProps' \| 'caseStudies' \| 'testimonials' \| 'services' \| 'packages' \| 'team' \| 'blog' \| 'faqs' \| 'about' \| 'contact' \| 'images'/,
  "'hero' | 'valueProps' | 'caseStudies' | 'testimonials' | 'services' | 'packages' | 'team' | 'blog' | 'faqs' | 'about' | 'contact' | 'images' | 'careers'"
);

// 2. Add draft state
content = content.replace(
  /const \[contactDraft, setContactDraft\] = useState\(safeContent\.contact \|\| DEFAULT_SITE_CONTENT\.contact\);/,
  "const [contactDraft, setContactDraft] = useState(safeContent.contact || DEFAULT_SITE_CONTENT.contact);\n  const [careersDraft, setCareersDraft] = useState(safeContent.careers || { noPositionsMessage: \"We're always looking for exceptional talent, but we don't have any open positions right now. Check back soon!\", openPositions: [] });"
);

// 3. Add save handler
content = content.replace(
  /const handleSaveContact = \(e: React\.FormEvent\) => \{\n\s+e\.preventDefault\(\);\n\s+updateSiteContent\('contact', contactDraft\);\n\s+triggerSaved\('Contact details updated live!'\);\n\s+\};/,
  "const handleSaveContact = (e: React.FormEvent) => {\n    e.preventDefault();\n    updateSiteContent('contact', contactDraft);\n    triggerSaved('Contact details updated live!');\n  };\n\n  const handleSaveCareers = (e: React.FormEvent) => {\n    e.preventDefault();\n    updateSiteContent('careers', careersDraft);\n    triggerSaved('Careers page updated live!');\n  };"
);

// 4. Add tab definition
content = content.replace(
  /\{ id: 'contact' as const,\s+label: '9\. Contact',[\s\S]*?\},/,
  "{ id: 'contact' as const,       label: '9. Contact',          icon: <Link className=\"w-3.5 h-3.5\" />,       status: 'live',     tip: 'Global contact details and social links' },\n          { id: 'careers' as const,       label: '10. Careers',         icon: <Briefcase className=\"w-3.5 h-3.5\" />,  status: 'live',     tip: 'Manage open positions and messaging on /careers' },"
);

// 5. Add UI for careers tab at the bottom, just before `</div >` (or `</div>` of the main container).
// Let's find `activeTab === 'images'` and place it before that.

const careersUI = `
      {/* ── TAB: CAREERS ── */}
      {activeTab === 'careers' && (
        <form onSubmit={handleSaveCareers} className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-extrabold text-lg text-[var(--text-heading)]">Careers Page Content</h3>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer">
              Save Careers Changes
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">No Open Positions Message</label>
            <textarea
              value={careersDraft.noPositionsMessage}
              onChange={(e) => setCareersDraft({ ...careersDraft, noPositionsMessage: e.target.value })}
              rows={3}
              className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-3 text-xs"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)]">Open Positions ({(careersDraft.openPositions || []).length})</label>
              <button
                type="button"
                onClick={() => setCareersDraft({ ...careersDraft, openPositions: [...(careersDraft.openPositions || []), { title: '', department: '', location: '' }] })}
                className="text-xs font-bold text-[var(--brand-teal)] hover:underline"
              >
                + Add Position
              </button>
            </div>
            
            {(careersDraft.openPositions || []).map((pos, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] relative group">
                <button
                  type="button"
                  onClick={() => {
                    const newArr = [...careersDraft.openPositions];
                    newArr.splice(idx, 1);
                    setCareersDraft({ ...careersDraft, openPositions: newArr });
                  }}
                  className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-rose-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={pos.title}
                    onChange={(e) => {
                      const newArr = [...careersDraft.openPositions];
                      newArr[idx].title = e.target.value;
                      setCareersDraft({ ...careersDraft, openPositions: newArr });
                    }}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Department (e.g. Engineering)"
                    value={pos.department}
                    onChange={(e) => {
                      const newArr = [...careersDraft.openPositions];
                      newArr[idx].department = e.target.value;
                      setCareersDraft({ ...careersDraft, openPositions: newArr });
                    }}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Location (e.g. Remote, Lahore)"
                    value={pos.location}
                    onChange={(e) => {
                      const newArr = [...careersDraft.openPositions];
                      newArr[idx].location = e.target.value;
                      setCareersDraft({ ...careersDraft, openPositions: newArr });
                    }}
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </form>
      )}
`;

content = content.replace(
  /\{\/\*\s*──\s*TAB 9: IMAGE ASSET STUDIO\s*──\s*\*\/\}/,
  careersUI + "\n\n      {/* ── TAB 11: IMAGE ASSET STUDIO ── */}"
);

fs.writeFileSync('src/components/portal/SiteContentManager.tsx', content, 'utf8');
