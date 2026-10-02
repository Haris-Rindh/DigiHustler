const fs = require('fs');

let team = fs.readFileSync('src/components/public/Team.tsx', 'utf8');
team = team.replace(/aPinnedIdx \| bPinnedIdx/g, 'aPinnedIdx - bPinnedIdx');
team = team.replace(/member\.skills\.length \| 3/g, 'member.skills.length - 3');
fs.writeFileSync('src/components/public/Team.tsx', team);

let auth = fs.readFileSync('src/components/portal/AuthLogin.tsx', 'utf8');
auth = auth.replace(/prev \| 1/g, 'prev - 1');
fs.writeFileSync('src/components/portal/AuthLogin.tsx', auth);
