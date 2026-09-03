import { supabase, isSupabaseConfigured } from './supabase';
import { User, Lead, Project, Assignment, Certificate, Announcement, SiteContent, SecurityAuditLog, Payout, Applicant, GlobalAdminSettings, GroupId, PipelineStage, UserRole, UserRoleTier } from '../types';

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
        auditsRes,
        payoutsRes,
        applicantsRes,
        settingsRes
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('assignments').select('*').order('created_at', { ascending: false }),
        supabase.from('certificates').select('*').order('created_at', { ascending: false }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('site_content').select('*').eq('id', 'primary_cms').single(),
        supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(200),
        supabase.from('payouts').select('*').order('paid_at', { ascending: false }),
        supabase.from('applicants').select('*').order('applied_at', { ascending: false }),
        supabase.from('settings').select('*').eq('id', 'global').single()
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
        payouts: payoutsRes.data ? payoutsRes.data.map(mapPayoutFromDb) : null,
        applicants: applicantsRes.data ? applicantsRes.data.map(mapApplicantFromDb) : null,
        settings: settingsRes.data ? mapSettingsFromDb(settingsRes.data) : null,
      };
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local store:', err);
      return null;
    }
  },

  // ── Get cloud user count for safe Member ID generation ──
  async getCloudUserCount(): Promise<number> {
    if (!isSupabaseConfigured || !supabase) return 0;
    try {
      const { count } = await supabase.from('users').select('id', { count: 'exact', head: true });
      return count || 0;
    } catch {
      return 0;
    }
  },

  // ── 2. Users CRUD ──
  async upsertUser(user: User): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Database not connected' };
    try {
      // Encode isCeoMaster flag inside custom_permissions so it persists cross-device
      const basePerms = (user.delegatedPermissions || []).filter((p: string) => p !== 'ceo_master');
      const permsWithFlags = user.isCeoMaster ? ['ceo_master', ...basePerms] : basePerms;
      
      const payload: Record<string, any> = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        role_tier: user.roleTier || (user.role === 'management' ? 'manager' : (user.role === 'group_leader' ? 'group_leader' : (user.role === 'intern' ? 'intern' : 'member'))),
        group_id: user.groupId || null,
        title: user.title || 'Specialist',
        avatar_url: user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=1F7A8C&color=fff`,
        specialties: user.specialties || [],
        status: user.status || 'active',
        join_year: user.joinYear || 2026,
        bio: user.bio || '',
        phone: user.phone || '',
        member_id: user.memberId || 'DGH2600167',
        password_hash: user.passwordHash || '',
        is_first_login: user.forcePasswordChange || false,
        custom_permissions: permsWithFlags,
        updated_at: new Date().toISOString()
      };

      let { error } = await supabase.from('users').upsert(payload);

      // If duplicate member_id collision, resolve dynamically and retry
      if (error && (error.code === '23505' || error.message?.includes('users_member_id_key'))) {
        console.warn('Member ID collision detected, recalculating next available ID...');
        const { data: latestUsers } = await supabase.from('users').select('member_id');
        let maxNum = 166;
        if (latestUsers) {
          latestUsers.forEach((u: any) => {
            const digits = (u.member_id || '').replace(/\D/g, '');
            const num = parseInt(digits.slice(-5), 10);
            if (!isNaN(num) && num > maxNum) maxNum = num;
          });
        }
        const freshId = `DGH26${String(maxNum + 1).padStart(5, '0')}`;
        payload.member_id = freshId;
        user.memberId = freshId;
        const retry = await supabase.from('users').upsert(payload);
        error = retry.error;
      }

      if (error) {
        console.error('Failed to sync user to Supabase:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Failed to sync user to Supabase:', err);
      return { success: false, error: err?.message || 'Database sync failed' };
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

  // ── Upload Avatar to Supabase Storage → returns permanent public URL ──
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${userId}.${ext}`;
      // upsert: replace if exists so the same path always reflects latest
      const { error } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) {
        console.error('Avatar upload error:', error.message);
        return null;
      }
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      // Append cache-buster so browsers immediately show the new image
      return `${data.publicUrl}?t=${Date.now()}`;
    } catch (err) {
      console.error('Avatar upload failed:', err);
      return null;
    }
  },

  // ── Convert Base64 avatar → upload to Supabase Storage → return URL ──
  async migrateBase64Avatar(userId: string, base64DataUrl: string): Promise<string | null> {
    if (!isSupabaseConfigured || !supabase) return null;
    if (!base64DataUrl.startsWith('data:image/')) return base64DataUrl; // already a URL
    try {
      const [header, data] = base64DataUrl.split(',');
      const mime = header.match(/data:(image\/\w+)/)?.[1] || 'image/jpeg';
      const ext = mime.split('/')[1] || 'jpg';
      const binary = atob(data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const file = new File([bytes], `${userId}.${ext}`, { type: mime });
      return await dbService.uploadAvatar(userId, file);
    } catch (err) {
      console.error('Base64 migration failed:', err);
      return null;
    }
  },

  // ── Upload Certificate / Offer Letter PDF to Supabase Storage ──
  // Returns the permanent public URL, or Base64 data URL on fallback.
  async uploadDocument(memberId: string, certId: string, file: File): Promise<string | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
        const cleanMemberId = (memberId || 'general').replace(/[^a-zA-Z0-9_-]/g, '_');
        const cleanCertId = (certId || `doc-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
        const path = `${cleanMemberId}/${cleanCertId}.${ext}`;
        const { error } = await supabase.storage
          .from('documents')
          .upload(path, file, { upsert: true, contentType: file.type || 'application/pdf' });
        if (!error) {
          const { data } = supabase.storage.from('documents').getPublicUrl(path);
          return `${data.publicUrl}?t=${Date.now()}`;
        }
        console.warn('Storage upload note (falling back to embedded file URL):', error.message);
      } catch (err) {
        console.warn('Storage upload error, falling back to embedded file URL:', err);
      }
    }

    // Fallback to Data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
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

  async deleteLead(leadId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('leads').delete().eq('id', leadId);
    } catch (err) {
      console.error('Failed to delete lead in Supabase:', err);
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

  async deleteProject(projectId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('projects').delete().eq('id', projectId);
    } catch (err) {
      console.error('Failed to delete project in Supabase:', err);
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

  async deleteAssignment(assignmentId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('assignments').delete().eq('id', assignmentId);
    } catch (err) {
      console.error('Failed to delete assignment in Supabase:', err);
    }
  },

  // ── 6. Certificates CRUD ──
  async upsertCertificate(cert: Certificate) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const mergedPdfConfig = {
        ...(cert.pdfConfig || {}),
        driveUrl: cert.driveUrl,
        isLocked: cert.isLocked !== undefined ? cert.isLocked : true,
        isHidden: Boolean(cert.isHidden),
        releasedAt: cert.releasedAt,
        notes: cert.notes
      };

      const { error } = await supabase.from('certificates').upsert({
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
        pdf_config: mergedPdfConfig,
        created_at: cert.issuedDate ? new Date(cert.issuedDate).toISOString() : new Date().toISOString()
      });
      if (error) console.error('Failed to upsert certificate in Supabase:', error.message);
    } catch (err) {
      console.error('Failed to upsert certificate in Supabase:', err);
    }
  },

  async deleteCertificate(certId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('certificates').delete().eq('id', certId);
    } catch (err) {
      console.error('Failed to delete certificate in Supabase:', err);
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
  },

  // ── 10. Payouts CRUD ──
  async upsertPayout(payout: Payout) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { error } = await supabase.from('payouts').upsert({
        id: payout.id,
        project_id: payout.projectId || '',
        project_title: payout.projectTitle || '',
        user_id: payout.userId || '',
        user_name: payout.userName || '',
        user_role: payout.userRole || 'freelancer',
        group_name: payout.groupName || '',
        role_description: payout.roleDescription || '',
        amount: payout.amount || 0,
        share_pct: payout.sharePct || 0,
        paid_at: payout.paidAt || new Date().toISOString()
      });
      if (error) console.error('Failed to upsert payout:', error.message);
    } catch (err) {
      console.error('Failed to upsert payout in Supabase:', err);
    }
  },

  async deletePayout(payoutId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('payouts').delete().eq('id', payoutId);
    } catch (err) {
      console.error('Failed to delete payout in Supabase:', err);
    }
  },

  // ── 11. Applicants CRUD ──
  async upsertApplicant(applicant: Applicant) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { error } = await supabase.from('applicants').upsert({
        id: applicant.id,
        name: applicant.name || '',
        email: applicant.email || '',
        phone: applicant.phone || '',
        preferred_group_id: applicant.preferredGroupId || 'tech',
        specialties: applicant.specialties || [],
        portfolio_url: applicant.portfolioUrl || null,
        digiskill_id: applicant.digiskillId || null,
        years_of_experience: applicant.yearsOfExperience || 0,
        bio: applicant.bio || '',
        applied_at: applicant.appliedAt || new Date().toISOString(),
        status: applicant.status || 'pending',
        rejection_reason: applicant.rejectionReason || null,
        follow_up_notes: applicant.followUpNotes || null
      });
      if (error) console.error('Failed to upsert applicant:', error.message);
    } catch (err) {
      console.error('Failed to upsert applicant in Supabase:', err);
    }
  },

  async updateApplicantStatus(applicantId: string, status: Applicant['status'], extra?: { rejectionReason?: string; followUpNotes?: string }) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('applicants').update({
        status,
        rejection_reason: extra?.rejectionReason || null,
        follow_up_notes: extra?.followUpNotes || null
      }).eq('id', applicantId);
    } catch (err) {
      console.error('Failed to update applicant status in Supabase:', err);
    }
  },

  async deleteApplicant(applicantId: string) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('applicants').delete().eq('id', applicantId);
    } catch (err) {
      console.error('Failed to delete applicant in Supabase:', err);
    }
  },

  // ── 12. Global Settings ──
  async saveSettings(settings: GlobalAdminSettings) {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { error } = await supabase.from('settings').upsert({
        id: 'global',
        default_management_split_pct: settings.defaultManagementSplitPct,
        default_leader_split_pct: settings.defaultLeaderSplitPct,
        default_freelancer_split_pct: settings.defaultFreelancerSplitPct,
        auto_approve_leads: settings.autoApproveLeads,
        payout_hold_days: settings.payoutHoldDays,
        allow_independent_lead_gen: settings.allowIndependentLeadGen,
        default_lead_gen_pct: settings.defaultLeadGenPct,
        min_freelancers_per_project: settings.minFreelancersPerProject,
        max_active_projects_per_freelancer: settings.maxActiveProjectsPerFreelancer,
        updated_at: new Date().toISOString()
      });
      if (error) console.error('Failed to save settings:', error.message);
    } catch (err) {
      console.error('Failed to save settings in Supabase:', err);
    }
  },

  // ── 13. Automated Self-Service Password Reset ──
  async createPasswordResetOtp(email: string, userName?: string): Promise<{ success: boolean; otp?: string; expiresAt?: string; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Database not configured' };
    try {
      const cleanEmail = email.trim().toLowerCase();
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      // Store in password_resets table if available
      try {
        await supabase.from('password_resets').insert({
          email: cleanEmail,
          otp_code: otpCode,
          expires_at: expiresAt,
          used: false
        });
      } catch {}

      // Store in memory / session fallback for instant zero-latency validation
      if (typeof window !== 'undefined') {
        const resetPayload = { email: cleanEmail, otp: otpCode, expiresAt: Date.now() + 15 * 60 * 1000 };
        sessionStorage.setItem(`dgh_reset_${cleanEmail}`, JSON.stringify(resetPayload));
      }

      // Record Audit Log for security monitoring
      await dbService.insertAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'system',
        actorName: userName || cleanEmail,
        actorRole: 'member',
        action: 'PASSWORD_RESET',
        details: `Password recovery OTP requested for ${cleanEmail}.`
      });

      return { success: true, otp: otpCode, expiresAt };
    } catch (err: any) {
      console.error('Failed to create password reset OTP:', err);
      return { success: false, error: err?.message || 'Failed to generate reset code' };
    }
  },

  async verifyAndResetPassword(email: string, otpInput: string, newPasswordHash: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) return { success: false, error: 'Database not configured' };
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanOtp = otpInput.trim();
      let isValid = false;

      // 1. Check Supabase password_resets table
      try {
        const { data } = await supabase
          .from('password_resets')
          .select('*')
          .eq('email', cleanEmail)
          .eq('otp_code', cleanOtp)
          .eq('used', false)
          .order('created_at', { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          const resetRow = data[0];
          if (new Date(resetRow.expires_at).getTime() > Date.now()) {
            isValid = true;
            await supabase.from('password_resets').update({ used: true }).eq('id', resetRow.id);
          }
        }
      } catch {}

      // 2. Check session fallback
      if (!isValid && typeof window !== 'undefined') {
        const stored = sessionStorage.getItem(`dgh_reset_${cleanEmail}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.otp === cleanOtp && parsed.expiresAt > Date.now()) {
            isValid = true;
            sessionStorage.removeItem(`dgh_reset_${cleanEmail}`);
          }
        }
      }

      if (!isValid) {
        return { success: false, error: 'Invalid or expired 6-digit verification code. Please request a new one.' };
      }

      // 3. Update password_hash in Supabase users table
      const { error: updateErr } = await supabase
        .from('users')
        .update({
          password_hash: newPasswordHash,
          is_first_login: false,
          updated_at: new Date().toISOString()
        })
        .eq('email', cleanEmail);

      if (updateErr) {
        return { success: false, error: updateErr.message };
      }

      // 4. Log security audit
      await dbService.insertAuditLog({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'system',
        actorName: cleanEmail,
        actorRole: 'member',
        action: 'PASSWORD_RESET',
        details: `Password was successfully self-reset using verified 6-digit OTP for ${cleanEmail}.`
      });

      return { success: true };
    } catch (err: any) {
      console.error('Failed to verify and reset password:', err);
      return { success: false, error: err?.message || 'Password update failed' };
    }
  }
};

// ── Helpers to map database column names to frontend camelCase types ──

function mapUserFromDb(row: any): User {
  const rawPerms = Array.isArray(row.custom_permissions) ? row.custom_permissions : [];
  const isCeoMaster = rawPerms.includes('ceo_master');
  const delegatedPermissions = rawPerms.filter((p: string) => p !== 'ceo_master');
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
    isCeoMaster,
    completedProjectsCount: 0,
    totalEarnings: 0,
    rating: 5.0,
    delegatedPermissions
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
  const pdfConf = (row.pdf_config && typeof row.pdf_config === 'object') ? row.pdf_config : {};
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
    pdfConfig: row.pdf_config,
    // Custom cloud properties stored in pdf_config
    driveUrl: pdfConf.driveUrl || row.drive_url || undefined,
    isLocked: pdfConf.isLocked !== undefined ? Boolean(pdfConf.isLocked) : true,
    isHidden: Boolean(pdfConf.isHidden),
    releasedAt: pdfConf.releasedAt || undefined,
    notes: pdfConf.notes || undefined
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

function mapPayoutFromDb(row: any): Payout {
  return {
    id: row.id,
    projectId: row.project_id || '',
    projectTitle: row.project_title || '',
    userId: row.user_id || '',
    userName: row.user_name || '',
    userRole: (row.user_role as UserRole) || 'freelancer',
    groupName: row.group_name || '',
    roleDescription: row.role_description || '',
    amount: Number(row.amount || 0),
    sharePct: Number(row.share_pct || 0),
    paidAt: row.paid_at || new Date().toISOString()
  };
}

function mapApplicantFromDb(row: any): Applicant {
  return {
    id: row.id,
    name: row.name || '',
    email: row.email || '',
    phone: row.phone || '',
    preferredGroupId: (row.preferred_group_id as GroupId) || 'tech',
    specialties: Array.isArray(row.specialties) ? row.specialties : [],
    portfolioUrl: row.portfolio_url || undefined,
    digiskillId: row.digiskill_id || undefined,
    yearsOfExperience: Number(row.years_of_experience || 0),
    bio: row.bio || '',
    appliedAt: row.applied_at || new Date().toISOString(),
    status: (row.status as Applicant['status']) || 'pending',
    rejectionReason: row.rejection_reason || undefined,
    followUpNotes: row.follow_up_notes || undefined
  };
}

function mapSettingsFromDb(row: any): GlobalAdminSettings {
  return {
    defaultManagementSplitPct: Number(row.default_management_split_pct ?? 20),
    defaultLeaderSplitPct: Number(row.default_leader_split_pct ?? 20),
    defaultFreelancerSplitPct: Number(row.default_freelancer_split_pct ?? 60),
    autoApproveLeads: Boolean(row.auto_approve_leads ?? false),
    payoutHoldDays: Number(row.payout_hold_days ?? 7),
    allowIndependentLeadGen: Boolean(row.allow_independent_lead_gen ?? true),
    defaultLeadGenPct: Number(row.default_lead_gen_pct ?? 15),
    minFreelancersPerProject: Number(row.min_freelancers_per_project ?? 1),
    maxActiveProjectsPerFreelancer: Number(row.max_active_projects_per_freelancer ?? 5)
  };
}
