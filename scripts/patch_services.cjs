const fs = require('fs');
let content = fs.readFileSync('src/components/portal/SiteContentManager.tsx', 'utf8');

const servicesBlock = `
        {/* ── TAB 2: SERVICES ── */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div>
                <h3 className="font-display font-extrabold text-base text-[var(--text-heading)]">
                  Services & Capabilities ({(siteContent.services || []).length})
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Manage the main service offerings shown on the homepage and /services.</p>
              </div>
              <button
                onClick={() => setShowAddService && setShowAddService(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(siteContent.services || []).map((service) => (
                <div key={service.id} className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <h4 className="font-bold text-sm text-[var(--text-heading)]">{service.title}</h4>
                    <button
                      onClick={() => {
                        if (confirm(\`Remove service '\${service.title}'?\`)) {
                          removeItemFromSiteContent('services', service.id);
                          triggerSaved('Service removed.');
                        }
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Service Title</label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => updateItemInSiteContent('services', service.id, { title: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Description</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => updateItemInSiteContent('services', service.id, { description: e.target.value })}
                      rows={3}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-xs text-[var(--text-body)]"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {showAddService && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <form onSubmit={handleCreateService} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <h3 className="font-bold text-base text-[var(--text-heading)]">Add New Service</h3>
                    <button type="button" onClick={() => setShowAddService(false)} className="text-[var(--text-muted)] hover:text-[var(--text-heading)]"><X className="w-5 h-5" /></button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Service Title</label>
                    <input
                      type="text"
                      required
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">Description</label>
                    <textarea
                      required
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      rows={3}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <button type="button" onClick={() => setShowAddService(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]">Cancel</button>
                    <button type="submit" className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold">Add Service</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
`;

content = content.replace(
  /\{\/\*\s*──\s*TAB 3:\s*CASE STUDIES.*?\*\/\}/,
  servicesBlock + '\n\n        {/* ── TAB 3: CASE STUDIES & PROJECTS ── */}'
);

fs.writeFileSync('src/components/portal/SiteContentManager.tsx', content, 'utf8');
