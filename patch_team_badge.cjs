const fs = require('fs');
let content = fs.readFileSync('src/components/public/Team.tsx', 'utf8');

content = content.replace(/<h2 className="text-xl sm:text-2xl font-display font-extrabold text-\[var\(--text-heading\)\] line-clamp-1 break-words">/, `<h2 className="text-xl sm:text-2xl font-display font-extrabold text-[var(--text-heading)] line-clamp-1 break-words flex items-center gap-2">`);
content = content.replace(/\{member\.name\}/, `{member.name}{member.roleTier && <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-[10px] uppercase tracking-widest font-black border border-[var(--brand-teal)]/20 align-middle shrink-0">{member.roleTier}</span>}`);

content = content.replace(/<h2 className="text-2xl sm:text-3xl font-display font-black text-\[var\(--text-heading\)\] leading-tight">/, `<h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--text-heading)] leading-tight flex items-center gap-2">`);
content = content.replace(/\{selectedMember\.name\}/, `{selectedMember.name}{selectedMember.roleTier && <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-xs uppercase tracking-widest font-black border border-[var(--brand-teal)]/20 align-middle shrink-0">{selectedMember.roleTier}</span>}`);

fs.writeFileSync('src/components/public/Team.tsx', content);
