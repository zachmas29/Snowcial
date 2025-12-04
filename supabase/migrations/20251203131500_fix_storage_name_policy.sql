-- Fix storage RLS name checks for UUID user IDs
-- The previous policies used string_to_array(name, '-') to extract the
-- user id prefix, which breaks for UUIDs containing hyphens. This
-- migration updates the policies to use a simple prefix match instead.

-- Drop existing insert policies so we can recreate them with the
-- corrected name check.

drop policy if exists "Users can upload own profile photos" on storage.objects;

drop policy if exists "Users can upload own banner photos" on storage.objects;

drop policy if exists "Users can upload own gallery photos" on storage.objects;

-- Recreate insert-only, ownership-based policies using a prefix match:
-- object name must start with the caller's auth.uid() followed by '-'.

create policy "Users can upload own profile photos"
  on storage.objects
  as permissive
  for insert
  to authenticated
  with check (
    bucket_id = 'profile-photos'
    and name like (auth.uid()::text || '-%')
  );

create policy "Users can upload own banner photos"
  on storage.objects
  as permissive
  for insert
  to authenticated
  with check (
    bucket_id = 'banner-photos'
    and name like (auth.uid()::text || '-%')
  );

create policy "Users can upload own gallery photos"
  on storage.objects
  as permissive
  for insert
  to authenticated
  with check (
    bucket_id = 'gallery-photos'
    and name like (auth.uid()::text || '-%')
  );
