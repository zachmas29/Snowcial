-- Harden storage bucket policies for user photos
-- Goal: insert-only, ownership-based; no update/delete via anon clients

-- Drop permissive authenticated-role-based insert/update policies

drop policy if exists "Authenticated users can upload profile photos" on storage.objects;

drop policy if exists "Authenticated users can update profile photos" on storage.objects;

drop policy if exists "Authenticated users can upload banner photos" on storage.objects;

drop policy if exists "Authenticated users can update banner photos" on storage.objects;

drop policy if exists "Authenticated users can upload gallery photos" on storage.objects;

drop policy if exists "Authenticated users can update gallery photos" on storage.objects;

-- Note: delete policies for these buckets were already dropped in
-- 20251203120000_remove_storage_delete_policies.sql


-- Reintroduce secure, ownership-based INSERT policies only.
-- File naming convention: names begin with "{userId}-" where userId is auth.uid().

-- Profile photos bucket
create policy "Users can upload own profile photos"
  on storage.objects
  as permissive
  for insert
  to authenticated
  with check (
    bucket_id = 'profile-photos'
    and (select auth.uid())::text = (string_to_array(name, '-'))[1]
  );

-- Banner photos bucket
create policy "Users can upload own banner photos"
  on storage.objects
  as permissive
  for insert
  to authenticated
  with check (
    bucket_id = 'banner-photos'
    and (select auth.uid())::text = (string_to_array(name, '-'))[1]
  );

-- Gallery photos bucket
create policy "Users can upload own gallery photos"
  on storage.objects
  as permissive
  for insert
  to authenticated
  with check (
    bucket_id = 'gallery-photos'
    and (select auth.uid())::text = (string_to_array(name, '-'))[1]
  );

-- Existing SELECT policies ("Anyone can view ...") remain unchanged.
