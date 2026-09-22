const fs = require('fs');
let content = fs.readFileSync('src/components/portal/SiteContentManager.tsx', 'utf8');

content = content.replace(
  /const handleSaveContact = \(e: React\.FormEvent\) => \{\s+e\.preventDefault\(\);\s+updateSiteContent\('contact', contactDraft\);\s+triggerSaved\('Contact details updated live!'\);\s+\};/,
  "const handleSaveContact = (e: React.FormEvent) => { e.preventDefault(); updateSiteContent('contact', contactDraft); triggerSaved('Contact details updated live!'); };\n\n  const handleSaveCareers = (e: React.FormEvent) => {\n    e.preventDefault();\n    updateSiteContent('careers', careersDraft);\n    triggerSaved('Careers page updated live!');\n  };"
);

content = content.replace(
  /\{\s*id: 'contact' as const,\s*label: '9\. Contact',.*?\}/,
  "{ id: 'contact' as const, label: '9. Contact', icon: <Link className=\"w-3.5 h-3.5\" />, status: 'live', tip: 'Global contact details and social links' },\n          { id: 'careers' as const, label: '10. Careers', icon: <Briefcase className=\"w-3.5 h-3.5\" />, status: 'live', tip: 'Manage open positions and messaging on /careers' }"
);

fs.writeFileSync('src/components/portal/SiteContentManager.tsx', content, 'utf8');
