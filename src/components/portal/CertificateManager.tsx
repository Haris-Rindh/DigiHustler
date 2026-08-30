import React, { useState } from 'react';
import { 
  Award, Plus, CheckCircle2, AlertTriangle, ExternalLink, 
  FileText, Search, Check, X, Eye, 
  Trash2, Edit3, Lock, Unlock, Download, Link2, Sparkles, Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Certificate, CertificateType, User as UserType, GroupId } from '../../types';

interface DocumentUploadEntry {
  id: string;
  type: CertificateType;
  customType: string;
  title: string;
  driveUrl: string;
  durationText: string;
  isLocked: boolean;
  notes: string;
}

export const CertificateManager: React.FC = () => {
  const { 
    certificates, users, currentTier, currentUser, groups,
    attachMemberDriveDocument, toggleCertificateLock, updateCertificateDriveUrl,
    deleteCertificate, showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSquad, setSelectedSquad] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Modals
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [editModalCert, setEditModalCert] = useState<Certificate | null>(null);
  const [selectedMemberForAttach, setSelectedMemberForAttach] = useState<UserType | null>(null);

  // Multi-Document entries for Attach Modal
  const [docEntries, setDocEntries] = useState<DocumentUploadEntry[]>([]);

  // Form states for Edit Modal
  const [editTitle, setEditTitle] = useState('');
  const [editDriveUrl, setEditDriveUrl] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-xs text-[var(--text-muted)]">Loading credentials vault...</p>
      </div>
    );
  }

  const isManagement = currentTier === 'ceo' || currentTier === 'manager';

  // Open attach modal for a specific user
  const handleOpenAttachModal = (user: UserType, defaultType: CertificateType = 'offer_letter') => {
    setSelectedMemberForAttach(user);
    
    let defaultTitle = 'Internship Offer Letter';
    if (defaultType === 'offer_letter') {
      defaultTitle = user.roleTier === 'intern' ? 'Internship Offer Letter' : 'Specialist Engagement Offer Letter';
    } else if (defaultType === 'internship_certificate') {
      defaultTitle = 'Certificate of Internship Completion';
    } else if (defaultType === 'experience_certificate') {
      defaultTitle = 'Official Certificate of Experience';
    } else if (defaultType === 'appreciation') {
      defaultTitle = 'Letter of Appreciation & Contribution';
    } else {
      defaultTitle = 'Official Recommendation Letter';
    }

    setDocEntries([
      {
        id: `entry-${Date.now()}-1`,
        type: defaultType,
        customType: defaultType === 'other' ? 'Recommendation Letter' : '',
        title: defaultTitle,
        driveUrl: '',
        durationText: '45 Days (Remote)',
        isLocked: true,
        notes: ''
      }
    ]);
    setAttachModalOpen(true);
  };

  const handleAddEntry = () => {
    setDocEntries(prev => [
      ...prev,
      {
        id: `entry-${Date.now()}-${prev.length + 1}`,
        type: 'experience_certificate',
        customType: '',
        title: 'Official Certificate of Experience',
        driveUrl: '',
        durationText: '6 Months',
        isLocked: true,
        notes: ''
      }
    ]);
  };

  const handleRemoveEntry = (id: string) => {
    if (docEntries.length <= 1) return;
    setDocEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateEntry = (id: string, updates: Partial<DocumentUploadEntry>) => {
    setDocEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const handleAttachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForAttach) {
      showToast('Please select a member.', 'error');
      return;
    }

    const invalid = docEntries.find(entry => !entry.driveUrl.trim());
    if (invalid) {
      showToast(`Please provide a valid Google Drive link for "${invalid.title || 'all documents'}".`, 'error');
      return;
    }

    let createdCount = 0;
    docEntries.forEach(entry => {
      const finalTitle = entry.type === 'other' && entry.customType.trim() 
        ? (entry.title.trim() || entry.customType.trim())
        : (entry.title.trim() || 'Official Credential');

      attachMemberDriveDocument(selectedMemberForAttach.id, {
        type: entry.type === 'other' && entry.customType.trim() ? entry.customType.trim() : entry.type,
        documentTitle: finalTitle,
        driveUrl: entry.driveUrl.trim(),
        isLocked: entry.isLocked,
        durationText: entry.durationText.trim() || undefined,
        notes: entry.notes.trim() || undefined
      });
      createdCount++;
    });

    setAttachModalOpen(false);
  };

  const handleOpenEditModal = (cert: Certificate) => {
    setEditModalCert(cert);
    setEditTitle(cert.documentTitle || cert.type);
    setEditDriveUrl(cert.driveUrl || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalCert) return;
    if (!editDriveUrl.trim()) {
      showToast('Please provide a valid Google Drive link.', 'error');
      return;
    }

    updateCertificateDriveUrl(editModalCert.id, editDriveUrl.trim(), editTitle.trim());
    setEditModalCert(null);
  };

  // Filtered members for Management table
  const filteredUsers = (users || []).filter((u) => {
    if (!u) return false;
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.memberId && u.memberId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.title && u.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSquad = selectedSquad === 'all' || u.groupId === selectedSquad;
    const matchesRole = selectedRoleFilter === 'all' || u.roleTier === selectedRoleFilter || u.role === selectedRoleFilter;
    return matchesSearch && matchesSquad && matchesRole;
  });

  // Released vs Locked stats
  const totalCertsCount = (certificates || []).length;
  const releasedCertsCount = (certificates || []).filter(c => !c.isLocked).length;
  const lockedCertsCount = (certificates || []).filter(c => c.isLocked).length;

  // Member's own documents (for member/intern view)
  const myCertificates = (certificates || []).filter(c => c.memberId === currentUser.id);
  const myReleasedCerts = myCertificates.filter(c => !c.isLocked);
  const myLockedCerts = myCertificates.filter(c => c.isLocked);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-teal)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-[var(--brand-teal)]">
              Digital Credential & Letter Vault
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[var(--text-heading)]">
            Offer Letters & Experience Certificates
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-body)] max-w-2xl leading-relaxed">
            {isManagement
              ? 'Upload, attach, and govern official Google Drive offer letters, internship certificates, and credentials. Documents remain securely locked until released to member portals.'
              : 'Access, view, and download your official DigiHust verified offer letters, experience certificates, and credentials.'}
          </p>
        </div>

        {isManagement && (
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenAttachModal(users[0] || currentUser, 'offer_letter')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Attach Google Drive Doc</span>
            </button>
          </div>
        )}
      </div>

      {/* Metric Counters (Management Only) */}
      {isManagement && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Total Talent Pool</div>
            <div className="font-display font-black text-2xl text-[var(--text-heading)]">{users.length}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Verified member identities</div>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Linked Documents</div>
            <div className="font-display font-black text-2xl text-[var(--text-heading)]">{totalCertsCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Google Drive credentials</div>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="text-[11px] font-bold uppercase text-emerald-400 mb-1">Released to Portal</div>
            <div className="font-display font-black text-2xl text-emerald-400">{releasedCertsCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Unlocked & downloadable</div>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="text-[11px] font-bold uppercase text-amber-400 mb-1">Locked / Under Review</div>
            <div className="font-display font-black text-2xl text-amber-400">{lockedCertsCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Held by Management</div>
          </div>
        </div>
      )}

      {/* ── MEMBER / SPECIALIST / INTERN VIEW (MY CREDENTIALS) ── */}
      {!isManagement && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h2 className="font-display font-bold text-lg text-[var(--text-heading)]">
                  My Official Documents & Certificates
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Member ID: <strong className="text-[var(--brand-teal)] font-mono">{currentUser.memberId || 'DGH2600001'}</strong>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] text-xs font-bold border border-[var(--border-subtle)]">
                {myReleasedCerts.length} Released
              </span>
            </div>

            {myReleasedCerts.length === 0 && myLockedCerts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
                <Award className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
                <h3 className="font-bold text-sm text-[var(--text-heading)]">No Credentials Issued Yet</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                  Once DigiHust Management releases your official Internship Offer Letter, Completion Certificate, or Experience Document, it will appear here with instant Google Drive PDF download.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Released Documents */}
                {myReleasedCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-6 rounded-2xl bg-[var(--bg-page)] border-2 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg space-y-4 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>RELEASED & VERIFIED</span>
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        Issued: {cert.issuedDate}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-black text-base text-[var(--text-heading)] mb-1">
                        {cert.documentTitle || cert.type.replace('_', ' ').toUpperCase()}
                      </h4>
                      <p className="text-xs text-[var(--text-body)]">
                        {cert.roleTitle} · {cert.durationText || 'Verified Period'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        ID: {cert.id}
                      </span>
                      {cert.driveUrl && (
                        <a
                          href={cert.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download / Open PDF</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {/* Locked / Under Review Documents */}
                {myLockedCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-6 rounded-2xl bg-[var(--bg-page)] border-2 border-amber-500/30 opacity-80 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>LOCKED / UNDER REVIEW</span>
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        Pending Release
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-base text-[var(--text-heading)] mb-1">
                        {cert.documentTitle || 'Credential Document'}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        This document has been prepared by Management and will unlock once final evaluation is complete.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Download link will become active upon release.</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MANAGEMENT VIEW (FULL ROSTER + GOVERNANCE) ── */}
      {isManagement && (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by Member Name, Member ID (e.g. DGH2600001), or Title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--brand-teal)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedSquad}
                onChange={(e) => setSelectedSquad(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--brand-teal)]"
              >
                <option value="all">All Squads</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name.split('&')[0]}</option>
                ))}
              </select>

              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs text-[var(--text-heading)] focus:outline-none focus:border-[var(--brand-teal)]"
              >
                <option value="all">All Roles</option>
                <option value="intern">Interns</option>
                <option value="member">Specialists</option>
                <option value="group_leader">Squad Leads</option>
                <option value="manager">Managers</option>
                <option value="ceo">CEO</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-page)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Member Identity</th>
                    <th className="py-3.5 px-4">Squad</th>
                    <th className="py-3.5 px-4">Offer Letter</th>
                    <th className="py-3.5 px-4">Experience / Completion</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredUsers.map((member) => {
                    const memberCerts = (certificates || []).filter(c => c.memberId === member.id);
                    const offerLetter = memberCerts.find(c => c.type === 'offer_letter');
                    const expCert = memberCerts.find(c => c.type === 'internship_certificate' || c.type === 'experience_certificate' || c.type === 'completion_certificate');
                    const squadObj = groups.find(g => g.id === member.groupId);

                    return (
                      <tr key={member.id} className="hover:bg-[var(--bg-page)]/50 transition-colors">
                        
                        {/* Member Identity */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover border border-[var(--border-subtle)]"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[var(--text-heading)]">{member.name}</span>
                                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                                  {member.memberId || 'DGH2600001'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                                <span>{member.title}</span>
                                <span>·</span>
                                <span className="uppercase font-extrabold text-[10px] text-[var(--brand-teal)]">
                                  {member.roleTier || member.role}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Squad */}
                        <td className="py-4 px-4">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-page)] border border-[var(--border-subtle)] text-[var(--text-heading)]">
                            {squadObj?.name.split('&')[0] || member.groupId?.toUpperCase() || 'CORE'}
                          </span>
                        </td>

                        {/* Offer Letter Column */}
                        <td className="py-4 px-4">
                          {offerLetter ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleCertificateLock(offerLetter.id, !offerLetter.isLocked)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                                    offerLetter.isLocked
                                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                  }`}
                                  title={offerLetter.isLocked ? 'Click to Release to Member Portal' : 'Click to Lock / Hold Document'}
                                >
                                  {offerLetter.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                  <span>{offerLetter.isLocked ? 'LOCKED' : 'RELEASED'}</span>
                                </button>

                                {offerLetter.driveUrl && (
                                  <a
                                    href={offerLetter.driveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--brand-teal)]"
                                    title="Open Google Drive File"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                <button
                                  onClick={() => handleOpenEditModal(offerLetter)}
                                  className="p-1 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                                  title="Edit Drive Link"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="text-[11px] text-[var(--text-body)] truncate max-w-[160px]" title={offerLetter.documentTitle}>
                                {offerLetter.documentTitle || 'Offer Letter'}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenAttachModal(member, 'offer_letter')}
                              className="px-2.5 py-1.5 rounded-xl border border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-muted)] hover:text-[var(--brand-teal)] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Attach Offer</span>
                            </button>
                          )}
                        </td>

                        {/* Experience / Completion Certificate Column */}
                        <td className="py-4 px-4">
                          {expCert ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleCertificateLock(expCert.id, !expCert.isLocked)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                                    expCert.isLocked
                                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                  }`}
                                  title={expCert.isLocked ? 'Click to Release to Member Portal' : 'Click to Lock / Hold Document'}
                                >
                                  {expCert.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                                  <span>{expCert.isLocked ? 'LOCKED' : 'RELEASED'}</span>
                                </button>

                                {expCert.driveUrl && (
                                  <a
                                    href={expCert.driveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--brand-teal)]"
                                    title="Open Google Drive File"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                <button
                                  onClick={() => handleOpenEditModal(expCert)}
                                  className="p-1 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                                  title="Edit Drive Link"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="text-[11px] text-[var(--text-body)] truncate max-w-[160px]" title={expCert.documentTitle}>
                                {expCert.documentTitle || 'Experience Certificate'}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenAttachModal(member, member.roleTier === 'intern' ? 'internship_certificate' : 'experience_certificate')}
                              className="px-2.5 py-1.5 rounded-xl border border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-muted)] hover:text-[var(--brand-teal)] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Attach Certificate</span>
                            </button>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => handleOpenAttachModal(member, 'other')}
                            className="px-3 py-1.5 rounded-xl bg-[var(--bg-page)] hover:bg-[var(--brand-teal)] text-[var(--text-heading)] hover:text-white border border-[var(--border-subtle)] text-[11px] font-bold transition-all cursor-pointer"
                          >
                            + Attach Other
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ATTACH GOOGLE DRIVE DOCUMENTS (MULTI-DOCUMENT & RESPONSIVE) ── */}
      {attachModalOpen && selectedMemberForAttach && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col justify-between space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-[var(--text-heading)]">
                    Attach Google Drive Credentials & Letters
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Upload multiple verified Google Drive documents for this specialist.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAttachModalOpen(false)}
                className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Member Profile Banner */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedMemberForAttach.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={selectedMemberForAttach.name}
                  className="w-9 h-9 rounded-full object-cover border border-[var(--border-subtle)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[var(--text-heading)]">{selectedMemberForAttach.name}</span>
                    <span className="font-mono text-[10px] font-bold text-[var(--brand-teal)] px-2 py-0.5 rounded-md bg-[var(--brand-teal-subtle)] border border-[var(--border-subtle)]">
                      {selectedMemberForAttach.memberId || 'DGH2600001'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {selectedMemberForAttach.title} · <span className="uppercase font-bold text-[var(--brand-teal)]">{selectedMemberForAttach.roleTier || selectedMemberForAttach.role}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[var(--text-muted)] hidden sm:inline">
                {docEntries.length} {docEntries.length === 1 ? 'document' : 'documents'} queue
              </span>
            </div>

            {/* Scrollable Document Entries Form */}
            <form onSubmit={handleAttachSubmit} className="flex flex-col flex-1 overflow-hidden space-y-4">
              <div className="overflow-y-auto pr-1 sm:pr-2 space-y-4 max-h-[calc(92vh-280px)]">
                {docEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3.5 relative transition-all"
                  >
                    {/* Entry Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--brand-teal)] text-white text-[10px] font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-bold text-xs text-[var(--text-heading)]">
                          Document #{index + 1}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)]">
                          {entry.type === 'other' ? (entry.customType || 'Others') : entry.type.replace('_', ' ')}
                        </span>
                      </div>

                      {docEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEntry(entry.id)}
                          className="px-2 py-1 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Document Category Dropdown */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                          Document Category *
                        </label>
                        <select
                          value={entry.type}
                          onChange={(e) => {
                            const newType = e.target.value as CertificateType;
                            let autoTitle = entry.title;
                            if (newType === 'offer_letter') {
                              autoTitle = selectedMemberForAttach.roleTier === 'intern' ? 'Internship Offer Letter' : 'Specialist Offer Letter';
                            } else if (newType === 'internship_certificate') {
                              autoTitle = 'Certificate of Internship Completion';
                            } else if (newType === 'experience_certificate') {
                              autoTitle = 'Official Certificate of Experience';
                            } else if (newType === 'appreciation') {
                              autoTitle = 'Letter of Appreciation & Contribution';
                            } else if (newType === 'other') {
                              autoTitle = entry.customType ? `${entry.customType} — DigiHust` : 'Official Verified Document';
                            }
                            handleUpdateEntry(entry.id, { 
                              type: newType, 
                              title: autoTitle,
                              customType: newType === 'other' ? (entry.customType || '') : '' 
                            });
                          }}
                          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] font-semibold focus:border-[var(--brand-teal)] focus:outline-none"
                        >
                          <option value="offer_letter">Offer Letter</option>
                          <option value="internship_certificate">Internship Completion Certificate</option>
                          <option value="experience_certificate">Experience Certificate</option>
                          <option value="appreciation">Letter of Appreciation</option>
                          <option value="other">Others (Specify Custom Category)</option>
                        </select>
                      </div>

                      {/* Custom Category Input (Revealed when type is 'other') */}
                      {entry.type === 'other' ? (
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1">
                            Mention Others Category *
                          </label>
                          <input
                            type="text"
                            required
                            value={entry.customType}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleUpdateEntry(entry.id, { 
                                customType: val,
                                title: val ? `${val} — DigiHust` : entry.title 
                              });
                            }}
                            placeholder="e.g. Recommendation Letter, Course Diploma, Award..."
                            className="w-full bg-[var(--bg-surface)] border-2 border-purple-500/40 rounded-xl px-3 py-2 text-xs text-[var(--text-heading)] focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                            Duration / Track Period
                          </label>
                          <input
                            type="text"
                            value={entry.durationText}
                            onChange={(e) => handleUpdateEntry(entry.id, { durationText: e.target.value })}
                            placeholder="e.g. 45 Days (Remote), 6 Months"
                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Document Title & Optional Custom Category Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                          Document Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={entry.title}
                          onChange={(e) => handleUpdateEntry(entry.id, { title: e.target.value })}
                          placeholder="e.g. DigiHust Internship Offer Letter"
                          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                        />
                      </div>

                      {entry.type === 'other' && (
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                            Duration / Track Period
                          </label>
                          <input
                            type="text"
                            value={entry.durationText}
                            onChange={(e) => handleUpdateEntry(entry.id, { durationText: e.target.value })}
                            placeholder="e.g. 45 Days (Remote), 6 Months"
                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-heading)]"
                          />
                        </div>
                      )}

                      {/* Google Drive Link */}
                      <div className={entry.type === 'other' ? 'sm:col-span-2' : ''}>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                          Google Drive URL *
                        </label>
                        <div className="relative">
                          <Link2 className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
                          <input
                            type="url"
                            required
                            value={entry.driveUrl}
                            onChange={(e) => handleUpdateEntry(entry.id, { driveUrl: e.target.value })}
                            placeholder="https://drive.google.com/file/d/.../view"
                            className="w-full pl-9 pr-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Portal Release Status Selector */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                        Portal Release Status
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div
                          onClick={() => handleUpdateEntry(entry.id, { isLocked: true })}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            entry.isLocked
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm ring-1 ring-amber-500/30'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-subtle)]'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 font-bold text-xs mb-0.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Hold as Locked</span>
                          </div>
                          <p className="text-[10px] leading-tight">Held privately by Management until released.</p>
                        </div>

                        <div
                          onClick={() => handleUpdateEntry(entry.id, { isLocked: false })}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            !entry.isLocked
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm ring-1 ring-emerald-500/30'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-subtle)]'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 font-bold text-xs mb-0.5">
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Release to Portal</span>
                          </div>
                          <p className="text-[10px] leading-tight">Immediately downloadable on the member's portal.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}

                {/* Add Another Document Button */}
                <button
                  type="button"
                  onClick={handleAddEntry}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-teal)] text-[var(--text-heading)] hover:text-[var(--brand-teal)] bg-[var(--bg-surface)] text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[var(--brand-teal)]" />
                  <span>+ Add Another Document for {selectedMemberForAttach.name}</span>
                </button>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)] flex-shrink-0">
                <div className="text-[11px] text-[var(--text-muted)]">
                  Total: <strong className="text-[var(--text-heading)]">{docEntries.length}</strong> credential(s) queued
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setAttachModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Attach & Save {docEntries.length} Document(s)
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT DRIVE LINK ── */}
      {editModalCert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-bold text-base text-[var(--text-heading)]">
                Edit Google Drive Link
              </h3>
              <button
                onClick={() => setEditModalCert(null)}
                className="p-1 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-heading)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Recipient
                </label>
                <div className="font-bold text-sm text-[var(--text-heading)]">
                  {editModalCert.memberName} ({editModalCert.memberDghId})
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-[var(--text-heading)]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Google Drive URL
                </label>
                <input
                  type="url"
                  required
                  value={editDriveUrl}
                  onChange={(e) => setEditDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-[var(--text-heading)]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => {
                    deleteCertificate(editModalCert.id);
                    setEditModalCert(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 font-bold hover:bg-rose-500/20 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditModalCert(null)}
                    className="px-4 py-2 rounded-xl font-semibold text-[var(--text-muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white font-bold cursor-pointer"
                  >
                    Update Link
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
