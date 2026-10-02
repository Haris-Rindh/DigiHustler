const fs = require('fs');
let content = fs.readFileSync('src/components/public/Team.tsx', 'utf8');

// Undo the incorrect replacement
content = content.replace(/key=\{member\.name\}\{member\.roleTier && <span.*?<\/span>\}/g, "key={member.name}");

content = content.replace(/<h2 className="text-xl sm:text-2xl font-display font-extrabold text-\[var\(--text-heading\)\] line-clamp-1 break-words flex items-center gap-2">\s*\{member\.name\}\s*<\/h2>/g, `<h2 className="text-xl sm:text-2xl font-display font-extrabold text-[var(--text-heading)] line-clamp-1 break-words flex items-center gap-2">
                        {member.name}{member.roleTier && <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-[10px] uppercase tracking-widest font-black border border-[var(--brand-teal)]/20 align-middle shrink-0">{member.roleTier}</span>}
                      </h2>`);

content = content.replace(/<h2 className="text-2xl sm:text-3xl font-display font-black text-\[var\(--text-heading\)\] leading-tight flex items-center gap-2">\s*\{selectedMember\.name\}\s*<\/h2>/g, `<h2 className="text-2xl sm:text-3xl font-display font-black text-[var(--text-heading)] leading-tight flex items-center gap-2">
                        {selectedMember.name}{selectedMember.roleTier && <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--brand-teal)]/10 text-[var(--brand-teal)] text-[10px] uppercase tracking-widest font-black border border-[var(--brand-teal)]/20 align-middle shrink-0">{selectedMember.roleTier}</span>}
                      </h2>`);

fs.writeFileSync('src/components/public/Team.tsx', content);
