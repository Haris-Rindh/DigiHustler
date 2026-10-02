const fs = require('fs');
let content = fs.readFileSync('src/components/portal/SiteContentManager.tsx', 'utf8');

content = content.replace(
  /impactLabel: newCaseStudy\.impactLabel \|\| 'Conversion Growth',/g,
  "impactLabel: newCaseStudy.impactLabel || 'Conversion Growth',\n        projectUrl: newCaseStudy.projectUrl || '',"
);

content = content.replace(
  /<div>\s*<label className="block text-xs font-bold uppercase text-\[var\(--text-muted\)\] mb-1">Image URL<\/label>\s*<input/g,
  `<div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Project Link (External URL)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newCaseStudy.projectUrl || ''}
                        onChange={(e) => setNewCaseStudy({ ...newCaseStudy, projectUrl: e.target.value })}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs mb-3"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Image URL</label>
                      <input`
);

fs.writeFileSync('src/components/portal/SiteContentManager.tsx', content);
