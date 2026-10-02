const fs = require('fs');
let auth = fs.readFileSync('src/components/portal/PortalLogin.tsx', 'utf8');
auth = auth.replace(/prev \| 1/g, 'prev - 1');
fs.writeFileSync('src/components/portal/PortalLogin.tsx', auth);
