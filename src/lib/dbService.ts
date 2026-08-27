import { supabase, isSupabaseConfigured } from './supabase';
import { User, Lead, Project, Assignment, Certificate, Announcement, SiteContent, SecurityAuditLog } from '../types';

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
        supabase.from('leads').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('assignments').select('*'),
        supabase.from('certificates').select('*'),
        supabase.from('announcements').select('*'),
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
        join_year: user.joinYear,
        bio: user.bio,
        phone: user.phone,
        member_id: user.memberId,
        password_hash: user.passwordHash,
        is_first_login: user.isFirstLogin || false,
        custom_permissions: user.customPermissions || [],
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
      await supabase.from('leads').insert({
        id: lead.id,
        client_name: lead.clientName,
        email: lead.email,
        company_name: lead.companyName,
        scope_description: lead.scopeDescription,
        target_group_id: lead.targetGroupId,
        budget_range: lead.budgetRange,
        timeline: lead.timeline,
        referral_source: lead.referralSource,
        status: lead.status,
        created_at: lead.createdAt,
        assigned_to: lead.assignedTo
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
      if (updates.assignedTo !== undefined) payload.assigned_to = updates.assignedTo;
      if (updates.scopeDescription) payload.scope_description = updates.scopeDescription;
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
        stage: project.stage,
        total_budget: project.totalBudget,
        currency: project.currency,
        client_deposit: project.clientDeposit,
        split_type: project.splitType,
        custom_freelancer_share: project.customFreelancerShare,
        custom_group_leader_share: project.customGroupLeaderShare,
        custom_management_share: project.customManagementShare,
        payout_released: project.payoutReleased,
        start_date: project.startDate,
        target_delivery_date: project.targetDeliveryDate,
        completed_date: project.completedDate,
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
        project_id: assignment.projectId,
        title: assignment.title,
        description: assignment.description,
        assigned_to_user_id: assignment.assignedToUserId,
        status: assignment.status,
        deadline: assignment.deadline,
        payout_amount: assignment.payoutAmount,
        currency: assignment.currency,
        deliverables: assignment.deliverables || [],
        submission_notes: assignment.submissionNotes,
        submitted_at: assignment.submittedAt,
        comments: assignment.comments || []
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
        document_title: cert.documentTitle,
        role_title: cert.roleTitle,
        start_date: cert.startDate,
        end_date: cert.endDate,
        issued_date: cert.issuedDate,
        status: cert.status,
        client_name: cert.clientName,
        project_details: cert.projectDetails,
        issued_by: cert.issuedBy,
        qr_code_url: cert.qrCodeUrl,
        duration_text: cert.durationText,
        stipend_terms: cert.stipendTerms,
        evaluation_criteria: cert.evaluationCriteria || [],
        intro_paragraph: cert.introParagraph,
        closing_paragraph: cert.closingParagraph,
        signatory_name: cert.signatoryName,
        signatory_title: cert.signatoryTitle,
        watermark_text: cert.watermarkText,
        contact_email: cert.contactEmail,
        contact_phone: cert.contactPhone,
        contact_address: cert.contactAddress,
        pdf_config: cert.pdfConfig
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
        content: announcement.content,
        scope: announcement.scope,
        group_id: announcement.groupId,
        author_id: announcement.authorId,
        author_name: announcement.authorName,
        author_role: announcement.authorRole,
        is_pinned: announcement.isPinned,
        priority: announcement.priority,
        created_at: announcement.createdAt,
        expires_at: announcement.expiresAt
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
        timestamp: log.timestamp,
        actor_id: log.actorId,
        actor_name: log.actorName,
        actor_role: log.actorRole,
        action: log.action,
        target_id: log.targetId,
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
    role: row.role,
    roleTier: row.role_tier,
    groupId: row.group_id,
    title: row.title,
    avatarUrl: row.avatar_url,
    specialties: row.specialties || [],
    status: row.status,
    joinYear: row.join_year,
    bio: row.bio,
    phone: row.phone,
    memberId: row.member_id,
    passwordHash: row.password_hash,
    isFirstLogin: row.is_first_login,
    customPermissions: row.custom_permissions || []
  };
}

function mapLeadFromDb(row: any): Lead {
  return {
    id: row.id,
    clientName: row.client_name,
    email: row.email,
    companyName: row.company_name,
    scopeDescription: row.scope_description,
    targetGroupId: row.target_group_id,
    budgetRange: row.budget_range,
    timeline: row.timeline,
    referralSource: row.referral_source,
    status: row.status,
    createdAt: row.created_at,
    assignedTo: row.assigned_to
  };
}

function mapProjectFromDb(row: any): Project {
  return {
    id: row.id,
    leadId: row.lead_id,
    title: row.title,
    clientName: row.client_name,
    groupId: row.group_id,
    stage: row.stage,
    totalBudget: Number(row.total_budget || 0),
    currency: row.currency,
    clientDeposit: Number(row.client_deposit || 0),
    splitType: row.split_type,
    customFreelancerShare: row.custom_freelancer_share ? Number(row.custom_freelancer_share) : undefined,
    customGroupLeaderShare: row.custom_group_leader_share ? Number(row.custom_group_leader_share) : undefined,
    customManagementShare: row.custom_management_share ? Number(row.custom_management_share) : undefined,
    payoutReleased: row.payout_released,
    startDate: row.start_date,
    targetDeliveryDate: row.target_delivery_date,
    completedDate: row.completed_date,
    deliverables: row.deliverables || []
  };
}

function mapAssignmentFromDb(row: any): Assignment {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description,
    assignedToUserId: row.assigned_to_user_id,
    status: row.status,
    deadline: row.deadline,
    payoutAmount: Number(row.payout_amount || 0),
    currency: row.currency,
    deliverables: row.deliverables || [],
    submissionNotes: row.submission_notes,
    submittedAt: row.submitted_at,
    comments: row.comments || []
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
    documentTitle: row.document_title,
    roleTitle: row.role_title,
    startDate: row.start_date,
    endDate: row.end_date,
    issuedDate: row.issued_date,
    status: row.status,
    clientName: row.client_name,
    projectDetails: row.project_details,
    issuedBy: row.issued_by,
    qrCodeUrl: row.qr_code_url,
    durationText: row.duration_text,
    stipendTerms: row.stipend_terms,
    evaluationCriteria: row.evaluation_criteria || [],
    introParagraph: row.intro_paragraph,
    closingParagraph: row.closing_paragraph,
    signatoryName: row.signatory_name,
    signatoryTitle: row.signatory_title,
    watermarkText: row.watermark_text,
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
    content: row.content,
    scope: row.scope,
    groupId: row.group_id,
    authorId: row.author_id,
    authorName: row.author_name,
    authorRole: row.author_role,
    isPinned: row.is_pinned,
    priority: row.priority,
    createdAt: row.created_at,
    expiresAt: row.expires_at
  };
}
