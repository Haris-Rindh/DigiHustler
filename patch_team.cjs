const fs = require('fs');
let content = fs.readFileSync('src/components/portal/SiteContentManager.tsx', 'utf8');

content = content.replace(/resetSiteContent, currentTier, currentUser, showToast/, "resetSiteContent, currentTier, currentUser, showToast, users");

const newDropdown = `
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Link Backend User (Optional)</label>
                      <select
                        onChange={(e) => {
                          const selectedUser = users.find(u => u.id === e.target.value);
                          if (selectedUser) {
                            setNewTeam({ 
                              ...newTeam, 
                              name: selectedUser.name,
                              roleTier: selectedUser.roleTier
                            });
                          }
                        }}
                        className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                      >
                        <option value="">-- Select a User --</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.roleTier})</option>
                        ))}
                      </select>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">Linking a user will auto-pull their name and Role Tier.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Full Name</label>
`;

content = content.replace(/<div>\s*<label className="block text-xs font-bold uppercase text-\[var\(--text-muted\)\] mb-1">Full Name<\/label>/, newDropdown);

fs.writeFileSync('src/components/portal/SiteContentManager.tsx', content);
