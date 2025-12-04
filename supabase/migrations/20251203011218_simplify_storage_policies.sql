drop policy if exists "Users can delete own banner photos" on "storage"."objects";

drop policy if exists "Users can delete own gallery photos" on "storage"."objects";

drop policy if exists "Users can delete own profile photos" on "storage"."objects";

drop policy if exists "Users can update own banner photos" on "storage"."objects";

drop policy if exists "Users can update own gallery photos" on "storage"."objects";

drop policy if exists "Users can update own profile photos" on "storage"."objects";

drop policy if exists "Users can upload own banner photos" on "storage"."objects";

drop policy if exists "Users can upload own gallery photos" on "storage"."objects";

drop policy if exists "Users can upload own profile photos" on "storage"."objects";


  drop policy if exists "Authenticated users can delete banner photos" on "storage"."objects";
  create policy "Authenticated users can delete banner photos"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'banner-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



  create policy "Authenticated users can delete gallery photos"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'gallery-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



  create policy "Authenticated users can delete profile photos"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'profile-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



  create policy "Authenticated users can update banner photos"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'banner-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



  create policy "Authenticated users can update gallery photos"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'gallery-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



  create policy "Authenticated users can update profile photos"
  on "storage"."objects"
  as permissive
  for update
  to public
using (((bucket_id = 'profile-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));


drop policy if exists "Authenticated users can upload banner photos" on storage.objects;
  create policy "Authenticated users can upload banner photos"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'banner-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



  drop policy if exists "Authenticated users can upload gallery photos" on "storage"."objects";
  create policy "Authenticated users can upload gallery photos"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'gallery-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



  drop policy if exists "Authenticated users can upload profile photos" on "storage"."objects";
  create policy "Authenticated users can upload profile photos"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'profile-photos'::text) AND (( SELECT auth.role() AS role) = 'authenticated'::text)));



