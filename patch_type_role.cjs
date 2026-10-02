const fs = require('fs');
let content = fs.readFileSync('src/types/index.ts', 'utf8');

if (!content.includes('roleTier?: UserRoleTier;')) {
  content = content.replace(/export interface SiteTeamMember \{/, "export interface SiteTeamMember {\n  roleTier?: UserRoleTier;");
  fs.writeFileSync('src/types/index.ts', content);
}
