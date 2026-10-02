const fs = require('fs');

// Fix Team.tsx
let team = fs.readFileSync('src/components/public/Team.tsx', 'utf8');
team = team.replace(/alt=\{selectedMember\.name\}\{selectedMember\.roleTier && <span.*?<\/span>\}/g, "alt={selectedMember.name}");
fs.writeFileSync('src/components/public/Team.tsx', team);

// Fix CaseStudyDetail.tsx duplicate ogImage
let cs = fs.readFileSync('src/components/public/CaseStudyDetail.tsx', 'utf8');
// remove the first ogImage we injected
cs = cs.replace(/ogImage=\{study\.imageUrl \|\| undefined\}\s+/g, "");
fs.writeFileSync('src/components/public/CaseStudyDetail.tsx', cs);
