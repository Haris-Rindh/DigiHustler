const fs = require('fs');
let content = fs.readFileSync('src/components/public/Work.tsx', 'utf8');
content = content.replace(/text-white/g, "text-[var(--text-heading)]");
fs.writeFileSync('src/components/public/Work.tsx', content);

let team = fs.readFileSync('src/components/public/Team.tsx', 'utf8');
team = team.replace(/text-white/g, "text-[var(--text-heading)]");
fs.writeFileSync('src/components/public/Team.tsx', team);
