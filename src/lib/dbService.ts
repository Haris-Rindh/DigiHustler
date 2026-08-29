import { supabase, isSupabaseConfigured } from './supabase';
import { User, Lead, Project, Assignment, Certificate, Announcement, SiteContent, SecurityAuditLog, GroupId, PipelineStage, UserRole, UserRoleTier } from '../types';

export const dbService = {
  // ── 1. Fetch All Initial Application State ──
  async fetchInitialData() {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const [
        usersRes,
        leadsRes,
        projectsRes,
        assignmentsRes,
        certsRes,
        announcementsRes,
        cmsRes,
        auditsRes
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('assignments').select('*').order('created_at', { ascending: false }),
        supabase.from('certificates').select('*').order('created_at', { ascending: false }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('site_content').select('*').eq('id', 'primary_cms').single(),
        supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(200)
      ]);

      return {
        users: usersRes.data ? usersRes.data.map(mapUserFromDb) : null,
        leads: leadsRes.data ? leadsRes.data.map(mapLeadFromDb) : null,
        projects: projectsRes.data ? projectsRes.data.map(mapProjectFromDb) : null,
        assignments: assignmentsRes.data ? assignmentsRes.data.map(mapAssignmentFromDb) : null,
        certificates: certsRes.data ? certsRes.data.map(mapCertFromDb) : null,
        announcements: announcementsRes.data ? announcementsRes.data.map(mapAnnouncementFromDb) : null,
        siteContent: cmsRes.data?.data as SiteContent | null,
        auditLogs: auditsRes.data ? (auditsRes.data as SecurityAuditLog[]) : null,
      };
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
      return null;
    }
  },

  // ── 2. Users CRUD ──
  async upsertUser(user: User) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('users').upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        role_tier: user.roleTier || user.role,
        group_id: user.groupId,
        title: user.title,
        avatar_url: user.avatarUrl,
        specialties: user.specialties || [],
        status: user.status,
        join_year: user.joinYear || 2026,
        bio: user.bio || '',
        phone: user.phone || '',
        member_id: user.memberId || '',
        password_hash: user.passwordHash || '',
        is_first_login: user.forcePasswordChange || false,
        custom_permissions: user.delegatedPermissions || [],
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to sync user to Supabase:', err);
    }
  },

  async deleteUser(userId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('users').delete().eq('id', userId);
    } catch (err) {
      console.error('Failed to delete user in Supabase:', err);
    }
  },

  // ── 3. Leads CRUD ──
  async insertLead(lead: Lead) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('leads').upsert({
        id: lead.id,
        client_name: lead.clientName,
        email: lead.clientEmail,
        company_name: lead.clientCompany || '',
        scope_description: lead.brief,
        target_group_id: lead.suggestedGroupId,
        budget_range: String(lead.budgetEstimate || 0),
        timeline: 'Flexible',
        referral_source: 'Website Client Portal',
        status: lead.status,
        created_at: lead.createdAt || new Date().toISOString(),
        assigned_to: lead.submittedByUserId
      });
    } catch (err) {
      console.error('Failed to insert lead to Supabase:', err);
    }
  },

  async updateLead(leadId: string, updates: Partial<Lead>) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const payload: Record<string, any> = {};
      if (updates.status) payload.status = updates.status;
      if (updates.clientName) payload.client_name = updates.clientName;
      if (updates.clientEmail) payload.email = updates.clientEmail;
      if (updates.clientCompany !== undefined) payload.company_name = updates.clientCompany;
      if (updates.brief) payload.scope_description = updates.brief;
      if (updates.suggestedGroupId) payload.target_group_id = updates.suggestedGroupId;
      if (updates.budgetEstimate !== undefined) payload.budget_range = String(updates.budgetEstimate);
      await supabase.from('leads').update(payload).eq('id', leadId);
    } catch (err) {
      console.error('Failed to update lead in Supabase:', err);
    }
  },

  // ── 4. Projects CRUD ──
  async upsertProject(project: Project) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('projects').upsert({
        id: project.id,
        lead_id: project.leadId,
        title: project.title,
        client_name: project.clientName,
        group_id: project.groupId,
        stage: project.status,
        total_budget: project.totalValue,
        currency: 'USD',
        client_deposit: project.externalFee || 0,
        split_type: project.isLeadGenIndependent ? 'independent_lead' : 'standard_squad',
        custom_freelancer_share: project.splitFreelancerPct,
        custom_group_leader_share: project.splitLeaderPct,
        custom_management_share: project.splitManagementPct,
        payout_released: project.status === 'paid',
        start_date: project.createdAt ? project.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        target_delivery_date: project.completedAt ? project.completedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        completed_date: project.completedAt ? project.completedAt.split('T')[0] : null,
        deliverables: project.deliverables || [],
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to upsert project in Supabase:', err);
    }
  },

  // ── 5. Assignments CRUD ──
  async upsertAssignment(assignment: Assignment) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('assignments').upsert({
        id: assignment.id,
        project_id: assignment.projectId || assignment.id,
        title: assignment.sanitizedBrief?.title || 'Assignment Sprint',
        description: assignment.sanitizedBrief?.scope || '',
        assigned_to_user_id: assignment.assignedLeaderId || assignment.assignedMemberIds?.[0] || 'usr-ceo-1',
        status: assignment.status,
        deadline: assignment.sanitizedBrief?.deadline || new Date().toISOString().split('T')[0],
        payout_amount: assignment.totalBudget || 0,
        currency: 'USD',
        deliverables: assignment.deliverables || [],
        submission_notes: JSON.stringify({
          sanitizedBrief: assignment.sanitizedBrief,
          subTasks: assignment.subTasks || [],
          milestones: assignment.milestones || [],
          assignedLeaderId: assignment.assignedLeaderId,
          assignedLeaderName: assignment.assignedLeaderName,
          assignedMemberIds: assignment.assignedMemberIds || [],
          squad: assignment.squad,
          clientName: assignment.clientName,
          clientEmail: assignment.clientEmail,
          clientCompany: assignment.clientCompany,
          totalBudget: assignment.totalBudget,
          createdBy: assignment.createdBy
        }),
        submitted_at: assignment.createdAt || new Date().toISOString(),
        comments: assignment.comments || [],
        created_at: assignment.createdAt || new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to upsert assignment in Supabase:', err);
    }
  },

  // ── 6. Certificates CRUD ──
  async upsertCertificate(cert: Certificate) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('certificates').upsert({
        id: cert.id,
        template_id: cert.templateId,
        member_id: cert.memberId,
        member_name: cert.memberName,
        member_dgh_id: cert.memberDghId,
        type: cert.type,
        document_title: cert.documentTitle || 'Official Certificate',
        role_title: cert.roleTitle,
        start_date: cert.startDate || new Date().toISOString().split('T')[0],
        end_date: cert.endDate,
        issued_date: cert.issuedDate || new Date().toISOString().split('T')[0],
        status: cert.status,
        client_name: cert.clientName,
        project_details: cert.projectDetails,
        issued_by: cert.issuedBy,
        qr_code_url: cert.qrCodeUrl || `/verify/${cert.id}`,
        duration_text: cert.durationText,
        stipend_terms: cert.stipendTerms,
        evaluation_criteria: cert.evaluationCriteria || [],
        intro_paragraph: cert.introParagraph,
        closing_paragraph: cert.closingParagraph,
        signatory_name: cert.signatoryName || 'Mahad Abbas',
        signatory_title: cert.signatoryTitle || 'Founder & CEO',
        watermark_text: cert.watermarkText || 'DigiHust',
        contact_email: cert.contactEmail || 'contact@digihust.com',
        contact_phone: cert.contactPhone || '+92 300 1234567',
        contact_address: cert.contactAddress || 'Islamabad / Global Remote Operations',
        pdf_config: cert.pdfConfig,
        created_at: cert.issuedDate ? new Date(cert.issuedDate).toISOString() : new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to upsert certificate in Supabase:', err);
    }
  },

  // ── 7. Announcements CRUD ──
  async upsertAnnouncement(announcement: Announcement) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('announcements').upsert({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content || announcement.body || '',
        scope: announcement.scope || 'global',
        group_id: announcement.groupId || null,
        author_id: announcement.postedBy || 'usr-ceo-1',
        author_name: announcement.postedByName || 'Mahad Abbas',
        author_role: announcement.postedByRole || 'ceo',
        is_pinned: false,
        priority: 'normal',
        created_at: announcement.postedAt || new Date().toISOString(),
        expires_at: announcement.expiresAt || null
      });
    } catch (err) {
      console.error('Failed to upsert announcement in Supabase:', err);
    }
  },

  async deleteAnnouncement(announcementId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('announcements').delete().eq('id', announcementId);
    } catch (err) {
      console.error('Failed to delete announcement in Supabase:', err);
    }
  },

  // ── 8. Site Content (CMS) ──
  async saveSiteContent(content: SiteContent) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('site_content').upsert({
        id: 'primary_cms',
        data: content,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to save CMS site content in Supabase:', err);
    }
  },

  // ── 9. Security Audit Logs ──
  async insertAuditLog(log: SecurityAuditLog) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('audit_logs').insert({
        id: log.id,
        timestamp: log.timestamp || new Date().toISOString(),
        actor_id: log.actorId,
        actor_name: log.actorName,
        actor_role: log.actorRole,
        action: log.action,
        target_id: log.targetId || null,
        details: log.details
      });
    } catch (err) {
      console.error('Failed to insert audit log in Supabase:', err);
    }
  }
};

// ── Helpers to map database column names to frontend camelCase types ──

function mapUserFromDb(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: (row.role as UserRole) || 'freelancer',
    roleTier: (row.role_tier as UserRoleTier) || 'member',
    groupId: row.group_id as GroupId,
    title: row.title || 'Specialist',
    avatarUrl: row.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'User')}&background=1F7A8C&color=fff`,
    specialties: Array.isArray(row.specialties) ? row.specialties : [],
    status: row.status || 'active',
    joinYear: row.join_year || 2026,
    bio: row.bio || '',
    phone: row.phone || '',
    memberId: row.member_id || 'DGH2600001',
    passwordHash: row.password_hash || '',
    forcePasswordChange: row.is_first_login || false,
    completedProjectsCount: 0,
    totalEarnings: 0,
    rating: 5.0,
    delegatedPermissions: Array.isArray(row.custom_permissions) ? row.custom_permissions : []
  };
}

function mapLeadFromDb(row: any): Lead {
  return {
    id: row.id,
    title: row.title || (row.scope_description ? row.scope_description.slice(0, 40) : `Inquiry from ${row.client_name}`),
    clientName: row.client_name || 'Client',
    clientEmail: row.email || '',
    clientCompany: row.company_name || '',
    submittedByUserId: row.assigned_to || 'usr-ceo-1',
    submittedByUserName: 'Client Portal Intake',
    brief: row.scope_description || '',
    budgetEstimate: Number(row.budget_range?.replace(/[^0-9.]/g, '') || 500),
    suggestedGroupId: (row.target_group_id as GroupId) || 'tech',
    status: (row.status === 'new' ? 'new_lead' : row.status) as PipelineStage,
    createdAt: row.created_at || new Date().toISOString()
  };
}

function mapProjectFromDb(row: any): Project {
  const totalValue = Number(row.total_budget || 0);
  const externalFee = Number(row.client_deposit || 0);
  return {
    id: row.id,
    leadId: row.lead_id,
    title: row.title || 'Client Project',
    clientName: row.client_name || 'Client',
    clientEmail: row.client_email || '',
    clientCompany: row.client_company || '',
    groupId: (row.group_id as GroupId) || 'tech',
    assignedLeaderId: row.assigned_leader_id || 'usr-leader-1',
    assignedLeaderName: row.assigned_leader_name || 'Squad Leader',
    brief: row.brief || row.title || '',
    totalValue,
    externalFee,
    netRevenue: totalValue - externalFee,
    isLeadGenIndependent: row.split_type === 'independent_lead',
    leadGenUserPct: 15,
    splitManagementPct: Number(row.custom_management_share || 20),
    splitLeaderPct: Number(row.custom_group_leader_share || 20),
    splitFreelancerPct: Number(row.custom_freelancer_share || 60),
    assignments: Array.isArray(row.assignments) ? row.assignments : [],
    status: (row.stage as PipelineStage) || 'assigned',
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    comments: Array.isArray(row.comments) ? row.comments : [],
    createdAt: row.created_at || new Date().toISOString(),
    completedAt: row.completed_date || undefined
  };
}

function mapAssignmentFromDb(row: any): Assignment {
  let parsedDetails: any = {};
  if (row.submission_notes && typeof row.submission_notes === 'string') {
    try {
      parsedDetails = JSON.parse(row.submission_notes);
    } catch {
      parsedDetails = {};
    }
  }

  return {
    id: row.id,
    projectId: row.project_id || parsedDetails.projectId,
    clientName: parsedDetails.clientName || 'Enterprise Client',
    clientEmail: parsedDetails.clientEmail,
    clientCompany: parsedDetails.clientCompany,
    totalBudget: parsedDetails.totalBudget || Number(row.payout_amount || 0),
    assignedLeaderId: parsedDetails.assignedLeaderId || row.assigned_to_user_id || 'usr-ceo-1',
    assignedLeaderName: parsedDetails.assignedLeaderName || 'Lead Coordinator',
    assignedMemberIds: parsedDetails.assignedMemberIds || [row.assigned_to_user_id || 'usr-member-1'],
    squad: (parsedDetails.squad as GroupId) || 'tech',
    status: (row.status as PipelineStage) || 'in_progress',
    sanitizedBrief: parsedDetails.sanitizedBrief || {
      title: row.title || 'Active Sprint Assignment',
      scope: row.description || 'Deliver project milestones according to specification.',
      deliverables: ['Production Code', 'Documentation'],
      deadline: row.deadline || new Date().toISOString().split('T')[0]
    },
    subTasks: Array.isArray(parsedDetails.subTasks) ? parsedDetails.subTasks : [],
    milestones: Array.isArray(parsedDetails.milestones) ? parsedDetails.milestones : [],
    deliverables: Array.isArray(row.deliverables) ? row.deliverables : [],
    comments: Array.isArray(row.comments) ? row.comments : [],
    createdBy: parsedDetails.createdBy || 'Management',
    createdAt: row.created_at || new Date().toISOString()
  };
}

function mapCertFromDb(row: any): Certificate {
  return {
    id: row.id,
    templateId: row.template_id,
    memberId: row.member_id,
    memberName: row.member_name,
    memberDghId: row.member_dgh_id,
    type: row.type,
    documentTitle: row.document_title || 'Official Certificate',
    roleTitle: row.role_title,
    startDate: row.start_date,
    endDate: row.end_date,
    issuedDate: row.issued_date,
    status: row.status,
    clientName: row.client_name,
    projectDetails: row.project_details,
    issuedBy: row.issued_by,
    qrCodeUrl: row.qr_code_url || `/verify/${row.id}`,
    durationText: row.duration_text,
    stipendTerms: row.stipend_terms,
    evaluationCriteria: Array.isArray(row.evaluation_criteria) ? row.evaluation_criteria : [],
    introParagraph: row.intro_paragraph,
    closingParagraph: row.closing_paragraph,
    signatoryName: row.signatory_name || 'Mahad Abbas',
    signatoryTitle: row.signatory_title || 'Founder & CEO',
    watermarkText: row.watermark_text || 'DigiHust',
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    contactAddress: row.contact_address,
    pdfConfig: row.pdf_config
  };
}

function mapAnnouncementFromDb(row: any): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content || '',
    body: row.content || '',
    scope: row.scope || 'global',
    groupId: row.group_id,
    postedBy: row.author_id || row.posted_by || 'usr-ceo-1',
    postedByName: row.author_name || row.posted_by_name || 'Mahad Abbas',
    postedByRole: (row.author_role || row.posted_by_role || 'ceo') as UserRoleTier,
    postedAt: row.created_at || row.posted_at || new Date().toISOString(),
    expiresAt: row.expires_at
  };
}

