const fs = require('fs');
let content = fs.readFileSync('src/components/portal/SiteContentManager.tsx', 'utf8');

content = content.replace(/role: newTeam\.role \|\| 'Specialist',/, "role: newTeam.role || 'Specialist',\n        roleTier: newTeam.roleTier,");

fs.writeFileSync('src/components/portal/SiteContentManager.tsx', content);
