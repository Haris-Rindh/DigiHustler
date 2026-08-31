import React, { useState, useRef } from 'react';
import { 
  Award, Plus, CheckCircle2, AlertTriangle, ExternalLink, 
  FileText, Search, Check, X, Eye, EyeOff,
  Trash2, Edit3, Lock, Unlock, Download, Link2, Sparkles, Filter,
  UploadCloud, FileCheck, Loader2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { dbService } from '../../lib/dbService';
import { Certificate, CertificateType, User as UserType, GroupId } from '../../types';

interface DocumentUploadEntry {
  id: string;
  type: CertificateType;
  customType: string;
  title: string;
  sourceType: 'file' | 'url';
  file?: File | null;
  fileName?: string;
  fileSize?: string;
  driveUrl: string;
  durationText: string;
  visibility: 'released' | 'locked_visible' | 'locked_hidden';
  notes: string;
}

export const CertificateManager: React.FC = () => {
  const { 
    certificates, users, currentTier, currentUser, groups,
    attachMemberDriveDocument, toggleCertificateLock, toggleCertificateHidden,
    updateCertificateDriveUrl, deleteCertificate, showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSquad, setSelectedSquad] = useState<string>('all');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Modals
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [editModalCert, setEditModalCert] = useState<Certificate | null>(null);
  const [selectedMemberForAttach, setSelectedMemberForAttach] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Multi-Document entries for Attach Modal
  const [docEntries, setDocEntries] = useState<DocumentUploadEntry[]>([]);

  // Form states for Edit Modal
  const [editTitle, setEditTitle] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editDriveUrl, setEditDriveUrl] = useState('');
  const [editVisibility, setEditVisibility] = useState<'released' | 'locked_visible' | 'locked_hidden'>('locked_visible');
  const [editSourceType, setEditSourceType] = useState<'file' | 'url'>('url');
  const [editFile, setEditFile] = useState<File | null>(null);

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
        sourceType: 'file',
        file: null,
        fileName: '',
        fileSize: '',
        driveUrl: '',
        durationText: '45 Days (Remote)',
        visibility: 'locked_visible',
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
        sourceType: 'file',
        file: null,
        fileName: '',
        fileSize: '',
        driveUrl: '',
        durationText: '6 Months',
        visibility: 'locked_visible',
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

  const handleAttachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForAttach) {
      showToast('Please select a member.', 'error');
      return;
    }

    // Validate entries
    for (const entry of docEntries) {
      if (entry.sourceType === 'url' && !entry.driveUrl.trim()) {
        showToast(`Please provide a valid Google Drive or web URL for "${entry.title || 'document'}".`, 'error');
        return;
      }
      if (entry.sourceType === 'file' && !entry.file && !entry.driveUrl.trim()) {
        showToast(`Please select a file to upload for "${entry.title || 'document'}".`, 'error');
        return;
      }
    }

    setIsSubmitting(true);
    let createdCount = 0;

    try {
      for (const entry of docEntries) {
        let finalUrl = entry.driveUrl.trim();

        // If file uploaded, upload to Supabase storage
        if (entry.sourceType === 'file' && entry.file) {
          const docId = `doc-${entry.type === 'offer_letter' ? 'off' : 'cert'}-${Math.random().toString(36).substring(2, 9)}`;
          const uploadedUrl = await dbService.uploadDocument(selectedMemberForAttach.id, docId, entry.file);
          if (uploadedUrl) {
            finalUrl = uploadedUrl;
          }
        }

        const finalTitle = entry.type === 'other' && entry.customType.trim() 
          ? (entry.title.trim() || entry.customType.trim())
          : (entry.title.trim() || 'Official Credential');

        const isLocked = entry.visibility !== 'released';
        const isHidden = entry.visibility === 'locked_hidden';

        attachMemberDriveDocument(selectedMemberForAttach.id, {
          type: entry.type === 'other' && entry.customType.trim() ? entry.customType.trim() : entry.type,
          documentTitle: finalTitle,
          driveUrl: finalUrl,
          isLocked,
          isHidden,
          durationText: entry.durationText.trim() || undefined,
          notes: entry.notes.trim() || undefined
        });
        createdCount++;
      }

      showToast(`Successfully saved and synced ${createdCount} document(s) to cloud.`, 'success');
      setAttachModalOpen(false);
    } catch (err) {
      console.error('Failed to attach document:', err);
      showToast('Error uploading document. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (cert: Certificate) => {
    setEditModalCert(cert);
    setEditTitle(cert.documentTitle || cert.type);
    setEditDuration(cert.durationText || '');
    setEditDriveUrl(cert.driveUrl || '');
    setEditSourceType(cert.driveUrl?.startsWith('data:') || cert.driveUrl?.includes('storage/v1/object/public') ? 'file' : 'url');
    setEditFile(null);

    let vis: 'released' | 'locked_visible' | 'locked_hidden' = 'locked_visible';
    if (!cert.isLocked) {
      vis = 'released';
    } else if (cert.isHidden) {
      vis = 'locked_hidden';
    } else {
      vis = 'locked_visible';
    }
    setEditVisibility(vis);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalCert) return;

    setIsSubmitting(true);
    try {
      let finalUrl = editDriveUrl.trim();
      if (editSourceType === 'file' && editFile) {
        const uploadedUrl = await dbService.uploadDocument(editModalCert.memberId, editModalCert.id, editFile);
        if (uploadedUrl) {
          finalUrl = uploadedUrl;
        }
      }

      const isLocked = editVisibility !== 'released';
      const isHidden = editVisibility === 'locked_hidden';

      updateCertificateDriveUrl(
        editModalCert.id, 
        finalUrl, 
        editTitle.trim(), 
        isLocked, 
        isHidden
      );

      setEditModalCert(null);
    } catch (err) {
      console.error('Failed to update document:', err);
      showToast('Error updating document.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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

  // Released vs Locked vs Hidden stats
  const totalCertsCount = (certificates || []).length;
  const releasedCertsCount = (certificates || []).filter(c => !c.isLocked).length;
  const lockedVisibleCount = (certificates || []).filter(c => c.isLocked && !c.isHidden).length;
  const lockedHiddenCount = (certificates || []).filter(c => c.isLocked && c.isHidden).length;

  // Member's own documents (for member/intern view)
  const myCertificates = (certificates || []).filter(c => c.memberId === currentUser.id);
  const myReleasedCerts = myCertificates.filter(c => !c.isLocked);
  const myLockedVisibleCerts = myCertificates.filter(c => c.isLocked && !c.isHidden);

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
              ? 'Upload PDF certificates, attach Google Drive offer letters, and govern member credentials. Control whether documents are Released, Locked (visible as Pending), or Completely Hidden.'
              : 'Access, view, and download your official DigiHust verified offer letters, experience certificates, and credentials.'}
          </p>
        </div>

        {isManagement && (
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenAttachModal(users[0] || currentUser, 'offer_letter')}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload / Attach Document</span>
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
            <div className="text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">Total Uploaded Docs</div>
            <div className="font-display font-black text-2xl text-[var(--text-heading)]">{totalCertsCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Verified files & Drive links</div>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="text-[11px] font-bold uppercase text-emerald-400 mb-1">Released to Portal (🔓)</div>
            <div className="font-display font-black text-2xl text-emerald-400">{releasedCertsCount}</div>
            <div className="text-[10px] text-[var(--text-muted)]">Unlocked & downloadable</div>
          </div>
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <div className="text-[11px] font-bold uppercase text-amber-400 mb-1">Locked / Held (🔒)</div>
            <div className="font-display font-black text-2xl text-amber-400">
              {lockedVisibleCount} <span className="text-xs font-normal text-purple-400">({lockedHiddenCount} hidden)</span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">Pending Executive release</div>
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

            {myReleasedCerts.length === 0 && myLockedVisibleCerts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[var(--bg-page)] border border-[var(--border-subtle)] space-y-3">
                <Award className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-40" />
                <h3 className="font-bold text-sm text-[var(--text-heading)]">No Credentials Issued Yet</h3>
                <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
                  Once DigiHust Management uploads and releases your official Internship Offer Letter, Completion Certificate, or Experience Document, it will appear here with an instant download button.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Released Documents */}
                {myReleasedCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-6 rounded-2xl bg-[var(--bg-page)] border-2 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg space-y-4 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>VERIFIED & RELEASED (🔓)</span>
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
                          Role: <strong className="text-[var(--text-heading)]">{cert.roleTitle}</strong> · {cert.durationText || 'Verified Track'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        ID: {cert.id}
                      </span>
                      {cert.driveUrl ? (
                        <a
                          href={cert.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={cert.documentTitle ? `${cert.documentTitle.replace(/\s+/g, '_')}.pdf` : 'DigiHust_Credential.pdf'}
                          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download PDF</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] font-medium">Ready for download</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Locked / Visible Documents */}
                {myLockedVisibleCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-6 rounded-2xl bg-[var(--bg-page)] border-2 border-amber-500/30 opacity-85 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          <span>LOCKED / UNDER MANAGEMENT REVIEW</span>
                        </span>
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          Pending Release
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-base text-[var(--text-heading)] mb-1">
                          {cert.documentTitle || 'Credential Document'}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          This official document has been prepared by DigiHust Management and will unlock for download once executive review is complete.
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] text-[11px] text-amber-400 font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Download link will activate upon release by CEO.</span>
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
                    const otherCerts = memberCerts.filter(c => c.id !== offerLetter?.id && c.id !== expCert?.id);
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
                              <div className="flex items-center gap-1.5">
                                {/* Lock Toggle */}
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

                                {/* Visibility Toggle (if locked) */}
                                {offerLetter.isLocked && (
                                  <button
                                    onClick={() => toggleCertificateHidden(offerLetter.id, !offerLetter.isHidden)}
                                    className={`p-1 rounded-lg transition-all cursor-pointer ${
                                      offerLetter.isHidden 
                                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' 
                                        : 'hover:bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                                    }`}
                                    title={offerLetter.isHidden ? 'Currently Completely Hidden (Click to make visible as Pending)' : 'Visible to member as Pending (Click to Hide)'}
                                  >
                                    {offerLetter.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                )}

                                {/* Download / Open File */}
                                {offerLetter.driveUrl && (
                                  <a
                                    href={offerLetter.driveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={`${offerLetter.documentTitle || 'Offer_Letter'}.pdf`}
                                    className="p-1 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--brand-teal)]"
                                    title="Open / Download Document"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                <button
                                  onClick={() => handleOpenEditModal(offerLetter)}
                                  className="p-1 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                                  title="Edit Document / Replace File"
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
                              <span>Upload Offer</span>
                            </button>
                          )}
                        </td>

                        {/* Experience / Completion Certificate Column */}
                        <td className="py-4 px-4">
                          {expCert ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5">
                                {/* Lock Toggle */}
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

                                {/* Visibility Toggle (if locked) */}
                                {expCert.isLocked && (
                                  <button
                                    onClick={() => toggleCertificateHidden(expCert.id, !expCert.isHidden)}
                                    className={`p-1 rounded-lg transition-all cursor-pointer ${
                                      expCert.isHidden 
                                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' 
                                        : 'hover:bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                                    }`}
                                    title={expCert.isHidden ? 'Currently Completely Hidden (Click to make visible as Pending)' : 'Visible to member as Pending (Click to Hide)'}
                                  >
                                    {expCert.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  </button>
                                )}

                                {/* Download / Open File */}
                                {expCert.driveUrl && (
                                  <a
                                    href={expCert.driveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download={`${expCert.documentTitle || 'Certificate'}.pdf`}
                                    className="p-1 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--brand-teal)]"
                                    title="Open / Download Document"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                )}

                                <button
                                  onClick={() => handleOpenEditModal(expCert)}
                                  className="p-1 rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text-heading)]"
                                  title="Edit Document / Replace File"
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
                              <span>Upload Certificate</span>
                            </button>
                          )}
                        </td>

                        {/* Actions & Other Attached Documents */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {otherCerts.length > 0 && (
                              <span className="text-[10px] font-bold text-[var(--brand-teal)] bg-[var(--brand-teal-subtle)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                                +{otherCerts.length} more
                              </span>
                            )}
                            <button
                              onClick={() => handleOpenAttachModal(member, 'other')}
                              className="px-3 py-1.5 rounded-xl bg-[var(--bg-page)] hover:bg-[var(--brand-teal)] text-[var(--text-heading)] hover:text-white border border-[var(--border-subtle)] text-[11px] font-bold transition-all cursor-pointer"
                            >
                              + Upload More
                            </button>
                          </div>
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

      {/* ── MODAL: UPLOAD & ATTACH DOCUMENTS (MULTI-DOCUMENT, DIRECT FILE & DRIVE LINK) ── */}
      {attachModalOpen && selectedMemberForAttach && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col justify-between space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] flex-shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[var(--brand-teal-subtle)] text-[var(--brand-teal)] border border-[var(--border-subtle)]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-[var(--text-heading)]">
                    Upload & Attach Member Documents
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Upload PDF files directly or paste Google Drive links. Set release & visibility status.
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
                {docEntries.length} {docEntries.length === 1 ? 'document' : 'documents'} in queue
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
                            placeholder="e.g. Recommendation Letter, Diploma..."
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

                    {/* Document Title */}
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

                    {/* Input Method Toggle (Option C: File Upload vs Google Drive URL) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                          Document Source *
                        </label>
                        <div className="flex items-center space-x-1 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
                          <button
                            type="button"
                            onClick={() => handleUpdateEntry(entry.id, { sourceType: 'file' })}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                              entry.sourceType === 'file' 
                                ? 'bg-[var(--brand-teal)] text-white shadow-sm' 
                                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                            }`}
                          >
                            Upload File (PDF)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateEntry(entry.id, { sourceType: 'url' })}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                              entry.sourceType === 'url' 
                                ? 'bg-[var(--brand-teal)] text-white shadow-sm' 
                                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                            }`}
                          >
                            Google Drive / Web URL
                          </button>
                        </div>
                      </div>

                      {entry.sourceType === 'file' ? (
                        <div className="p-3 rounded-xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-teal)] bg-[var(--bg-surface)] transition-all">
                          <label className="flex flex-col items-center justify-center cursor-pointer space-y-1">
                            <UploadCloud className="w-6 h-6 text-[var(--brand-teal)]" />
                            <span className="text-xs font-bold text-[var(--text-heading)]">
                              {entry.fileName ? entry.fileName : 'Click to select PDF or image file'}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {entry.fileSize ? `Size: ${entry.fileSize}` : 'Supported: PDF, JPG, PNG (Max 25MB)'}
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const sizeKb = (file.size / 1024).toFixed(1);
                                  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
                                  handleUpdateEntry(entry.id, {
                                    file,
                                    fileName: file.name,
                                    fileSize: file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`
                                  });
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="relative">
                          <Link2 className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
                          <input
                            type="url"
                            required={entry.sourceType === 'url'}
                            value={entry.driveUrl}
                            onChange={(e) => handleUpdateEntry(entry.id, { driveUrl: e.target.value })}
                            placeholder="https://drive.google.com/file/d/.../view"
                            className="w-full pl-9 pr-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-heading)] focus:border-[var(--brand-teal)] focus:outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* Visibility & Lock Status Selector (Option C: 3 States) */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                        Document Release & Visibility Status (CEO Control)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* 1. Released */}
                        <div
                          onClick={() => handleUpdateEntry(entry.id, { visibility: 'released' })}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            entry.visibility === 'released'
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-sm ring-1 ring-emerald-500/40'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-subtle)]'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 font-bold text-xs mb-0.5">
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Release to Portal</span>
                          </div>
                          <p className="text-[10px] leading-tight">Unlocked & immediately downloadable on member portal.</p>
                        </div>

                        {/* 2. Locked & Visible */}
                        <div
                          onClick={() => handleUpdateEntry(entry.id, { visibility: 'locked_visible' })}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            entry.visibility === 'locked_visible'
                              ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-sm ring-1 ring-amber-500/40'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-subtle)]'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 font-bold text-xs mb-0.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Hold as Locked</span>
                          </div>
                          <p className="text-[10px] leading-tight">Member sees "Pending Executive Review" badge (cannot download).</p>
                        </div>

                        {/* 3. Completely Hidden */}
                        <div
                          onClick={() => handleUpdateEntry(entry.id, { visibility: 'locked_hidden' })}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            entry.visibility === 'locked_hidden'
                              ? 'bg-purple-500/10 border-purple-500/50 text-purple-400 shadow-sm ring-1 ring-purple-500/40'
                              : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-subtle)]'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 font-bold text-xs mb-0.5">
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Completely Hidden</span>
                          </div>
                          <p className="text-[10px] leading-tight">100% invisible to member until CEO chooses to release.</p>
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
                    disabled={isSubmitting}
                    onClick={() => setAttachModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-hover)] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading & Syncing...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Attach & Save {docEntries.length} Document(s)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT DOCUMENT (TITLE, FILE REPLACEMENT, VISIBILITY) ── */}
      {editModalCert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="font-bold text-base text-[var(--text-heading)] flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[var(--brand-teal)]" />
                <span>Edit Document / Status</span>
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

              {/* Source Type Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Document Source
                  </label>
                  <div className="flex items-center space-x-1 bg-[var(--bg-page)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => setEditSourceType('file')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        editSourceType === 'file' ? 'bg-[var(--brand-teal)] text-white' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSourceType('url')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        editSourceType === 'url' ? 'bg-[var(--brand-teal)] text-white' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      Web / Drive URL
                    </button>
                  </div>
                </div>

                {editSourceType === 'file' ? (
                  <div className="p-3 rounded-xl border-2 border-dashed border-[var(--border-subtle)] bg-[var(--bg-page)] text-center">
                    <label className="cursor-pointer space-y-1 block">
                      <UploadCloud className="w-5 h-5 text-[var(--brand-teal)] mx-auto" />
                      <span className="text-[11px] font-bold text-[var(--text-heading)] block">
                        {editFile ? editFile.name : 'Click to replace document file'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={(e) => e.target.files?.[0] && setEditFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={editDriveUrl}
                    onChange={(e) => setEditDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view"
                    className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-[var(--text-heading)]"
                  />
                )}
              </div>

              {/* Status Selector */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Status & Member Visibility
                </label>
                <select
                  value={editVisibility}
                  onChange={(e) => setEditVisibility(e.target.value as any)}
                  className="w-full bg-[var(--bg-page)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2 text-[var(--text-heading)] font-semibold"
                >
                  <option value="released">🔓 Released (Downloadable by Member)</option>
                  <option value="locked_visible">🔒 Locked (Visible as Pending Review)</option>
                  <option value="locked_hidden">👁️‍🗨️ Completely Hidden from Member</option>
                </select>
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
                    disabled={isSubmitting}
                    onClick={() => setEditModalCert(null)}
                    className="px-4 py-2 rounded-xl font-semibold text-[var(--text-muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[var(--brand-teal)] text-white font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Save Changes</span>
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
