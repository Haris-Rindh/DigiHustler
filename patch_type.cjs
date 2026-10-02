const fs = require('fs');
let content = fs.readFileSync('src/types/index.ts', 'utf8');
content = content.replace(/pinnedMemberIds\?: string\[\];/, "pinnedMemberIds?: string[];\n  howItWorksVideoUrl?: string;");
fs.writeFileSync('src/types/index.ts', content);
