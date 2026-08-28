-- ==============================================================================
-- DigiHust Production PostgreSQL Schema for Supabase
-- ==============================================================================

-- 1. USERS & CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'freelancer',
  role_tier TEXT NOT NULL DEFAULT 'freelancer',
  group_id TEXT,
  title TEXT NOT NULL DEFAULT 'Specialist',
  avatar_url TEXT,
  specialties JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active',
  join_year INT DEFAULT 2026,
  bio TEXT,
  phone TEXT,
  member_id TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  is_first_login BOOLEAN DEFAULT false,
  custom_permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS & INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  scope_description TEXT NOT NULL,
  target_group_id TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  timeline TEXT NOT NULL,
  referral_source TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_to TEXT
);

-- 3. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  lead_id TEXT,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  group_id TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'scope_definition',
  total_budget NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  client_deposit NUMERIC DEFAULT 0,
  split_type TEXT NOT NULL DEFAULT 'standard_squad',
  custom_freelancer_share NUMERIC,
  custom_group_leader_share NUMERIC,
  custom_management_share NUMERIC,
  payout_released BOOLEAN DEFAULT false,
  start_date DATE NOT NULL,
  target_delivery_date DATE NOT NULL,
  completed_date DATE,
  deliverables JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assigned_to_user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  deadline DATE NOT NULL,
  payout_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  deliverables JSONB DEFAULT '[]'::jsonb,
  submission_notes TEXT,
  submitted_at TIMESTAMPTZ,
  comments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CERTIFICATES & OFFER LETTERS TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY,
  template_id TEXT,
  member_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  member_dgh_id TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'offer_letter',
  document_title TEXT NOT NULL DEFAULT 'Internship Offer Letter',
  role_title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  issued_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'valid',
  client_name TEXT NOT NULL,
  project_details TEXT,
  issued_by TEXT NOT NULL,
  qr_code_url TEXT NOT NULL,
  duration_text TEXT,
  stipend_terms TEXT,
  evaluation_criteria JSONB DEFAULT '[]'::jsonb,
  intro_paragraph TEXT,
  closing_paragraph TEXT,
  signatory_name TEXT DEFAULT 'Mahad Abbas',
  signatory_title TEXT DEFAULT 'Founder & CEO',
  watermark_text TEXT DEFAULT 'DigiHust',
  contact_email TEXT DEFAULT 'contact@digihust.com',
  contact_phone TEXT DEFAULT '+92 300 1234567',
  contact_address TEXT DEFAULT 'Islamabad / Global Remote Operations',
  pdf_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'global',
  group_id TEXT,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at DATE
);

-- 7. DYNAMIC CMS SITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'primary_cms',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SECURITY AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_id TEXT,
  details TEXT NOT NULL
);

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC READ FOR VERIFICATION
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Certificates Public Verification Policy
DROP POLICY IF EXISTS "Allow public read certificates" ON public.certificates;
CREATE POLICY "Allow public read certificates" ON public.certificates FOR SELECT USING (true);

-- 2. Site Content Public Read Policy
DROP POLICY IF EXISTS "Allow public read site_content" ON public.site_content;
CREATE POLICY "Allow public read site_content" ON public.site_content FOR SELECT USING (true);

-- 3. Leads Public Insert Policy (Client quote submissions)
DROP POLICY IF EXISTS "Allow public insert leads" ON public.leads;
CREATE POLICY "Allow public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- 4. Full Access Policies for System Operations
DROP POLICY IF EXISTS "Allow full access users" ON public.users;
CREATE POLICY "Allow full access users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access leads" ON public.leads;
CREATE POLICY "Allow full access leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access projects" ON public.projects;
CREATE POLICY "Allow full access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access assignments" ON public.assignments;
CREATE POLICY "Allow full access assignments" ON public.assignments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access certificates" ON public.certificates;
CREATE POLICY "Allow full access certificates" ON public.certificates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access announcements" ON public.announcements;
CREATE POLICY "Allow full access announcements" ON public.announcements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access site_content" ON public.site_content;
CREATE POLICY "Allow full access site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow full access audit_logs" ON public.audit_logs;
CREATE POLICY "Allow full access audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED: CEO ROOT MASTER CONTROLLER & PRIMARY CMS
-- ==============================================================================

INSERT INTO public.users (
  id, name, email, role, role_tier, title, phone, member_id, password_hash, status, join_year, specialties
) VALUES (
  'usr-ceo-1',
  'Mahad Abbas',
  'digihust@gmail.com',
  'management',
  'ceo',
  'Founder & CEO',
  '+92 303 7368528',
  'DGH2400001',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', -- quickHash of DigiHust@2026
  'active',
  2024,
  '["Executive Strategy", "Global Delivery Governance", "Enterprise Accounts"]'::jsonb
) ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone;

INSERT INTO public.announcements (
  id, title, content, scope, author_id, author_name, author_role
) VALUES (
  'ann-welcome',
  'Welcome to DigiHust Portal',
  'Welcome to the DigiHust enterprise platform. Manage specialized squads, client intake, and verified digital delivery from this central console.',
  'global',
  'usr-ceo-1',
  'Mahad Abbas',
  'ceo'
) ON CONFLICT (id) DO NOTHING;
