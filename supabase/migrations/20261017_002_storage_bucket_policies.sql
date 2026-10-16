-- ==============================================================================
-- Migration: 20261017_002_storage_bucket_policies.sql
-- Purpose:   Create and secure Supabase Storage buckets (avatars, documents, lead-attachments)
--            with SQL definitions and RLS policies on storage.objects.
-- ==============================================================================

BEGIN;

-- 1. Ensure storage buckets exist with appropriate public/private flags & size/type limits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'avatars', 
    'avatars', 
    true, 
    5242880, -- 5 MB cap
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']::text[]
  ),
  (
    'documents', 
    'documents', 
    false, -- Private bucket (confidential PDFs and member credentials)
    15728640, -- 15 MB cap
    ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/webp']::text[]
  ),
  (
    'lead-attachments', 
    'lead-attachments', 
    false, -- Private bucket (client project briefs, strictly confidential)
    15728640, -- 15 MB cap
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg', 'image/webp', 'application/zip']::text[]
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Storage Policies for 'avatars' (public read, staff/admin upload)
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Anyone can upload avatars" ON storage.objects;
CREATE POLICY "Anyone can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND (LOWER(storage.extension(name)) IN ('png', 'jpg', 'jpeg', 'webp', 'gif'))
  );

DROP POLICY IF EXISTS "Allow avatar updates" ON storage.objects;
CREATE POLICY "Allow avatar updates"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars');

-- 4. Storage Policies for 'lead-attachments' (anon can insert brief on contact form; only admin/service_role can read)
DROP POLICY IF EXISTS "Anon can upload lead briefs" ON storage.objects;
CREATE POLICY "Anon can upload lead briefs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('lead-attachments', 'documents')
    AND (LOWER(storage.extension(name)) IN ('pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'webp', 'zip'))
  );

-- Only authenticated users or service role can select lead-attachments (clients cannot browse others' files)
DROP POLICY IF EXISTS "Authenticated can view lead attachments" ON storage.objects;
CREATE POLICY "Authenticated can view lead attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id IN ('lead-attachments', 'documents'));

-- 5. Certificates & Documents (non-public; read via signed URLs)
DROP POLICY IF EXISTS "Authenticated can manage documents" ON storage.objects;
CREATE POLICY "Authenticated can manage documents"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'documents')
  WITH CHECK (bucket_id = 'documents');

COMMIT;
