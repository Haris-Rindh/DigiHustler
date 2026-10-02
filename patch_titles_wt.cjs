const fs = require('fs');
let content = fs.readFileSync('src/components/public/Work.tsx', 'utf8');
content = content.replace(/ \u2014 /g, ' | ').replace(/ \u2013 /g, ' | ').replace(/ - /g, ' | ');
fs.writeFileSync('src/components/public/Work.tsx', content);

let team = fs.readFileSync('src/components/public/Team.tsx', 'utf8');
team = team.replace(/ \u2014 /g, ' | ').replace(/ \u2013 /g, ' | ').replace(/ - /g, ' | ');
fs.writeFileSync('src/components/public/Team.tsx', team);
