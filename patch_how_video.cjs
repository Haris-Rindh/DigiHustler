const fs = require('fs');
let content = fs.readFileSync('src/components/portal/SiteContentManager.tsx', 'utf8');

content = content.replace(/const \[heroDraft, setHeroDraft\] = useState\(safeContent.hero \|\| DEFAULT_SITE_CONTENT.hero\);/g, `const [heroDraft, setHeroDraft] = useState(safeContent.hero || DEFAULT_SITE_CONTENT.hero);\n  const [howItWorksVideoUrlDraft, setHowItWorksVideoUrlDraft] = useState(safeContent.howItWorksVideoUrl || '');`);

content = content.replace(/updateSiteContent\('hero', heroDraft\);/g, `updateSiteContent('hero', heroDraft);\n    updateSiteContent('howItWorksVideoUrl', howItWorksVideoUrlDraft);`);

content = content.replace(/<label className="block text-xs font-bold uppercase text-\[var\(--text-muted\)\] mb-1">Badge Text<\/label>/g, `<div><label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">How It Works Video URL (YouTube/Vimeo Embed link)</label><input type="url" placeholder="https://www.youtube.com/embed/..." value={howItWorksVideoUrlDraft} onChange={(e) => setHowItWorksVideoUrlDraft(e.target.value)} className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs mb-4" /></div><label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Badge Text</label>`);

fs.writeFileSync('src/components/portal/SiteContentManager.tsx', content);
