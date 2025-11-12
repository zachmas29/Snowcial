drop policy "Users can manage own RSVPs" on "public"."event_rsvps";

drop policy "Users can manage tags for own events" on "public"."event_tag_assignments";

drop policy "Users can manage own gallery photos" on "public"."gallery_photos";

drop policy "Users can create comments" on "public"."event_comments";

drop policy "Users can delete own comments" on "public"."event_comments";

drop policy "Users can view all event comments" on "public"."event_comments";

drop policy "Users can view all RSVPs" on "public"."event_rsvps";

drop policy "Users can view event tag assignments" on "public"."event_tag_assignments";

drop policy "Users can view all event tags" on "public"."event_tags";

drop policy "Users can create events" on "public"."events";

drop policy "Users can delete own events" on "public"."events";

drop policy "Users can update own events" on "public"."events";

drop policy "Users can view all events" on "public"."events";

drop policy "Users can view all gallery photos" on "public"."gallery_photos";

drop policy "Users can manage own tags" on "public"."user_tag_assignments";

drop policy "Users can view all user tag assignments" on "public"."user_tag_assignments";

drop policy "Users can view all user tags" on "public"."user_tags";

drop policy "Users can update own profile" on "public"."users";

drop policy "Users can view all profiles" on "public"."users";


  create policy "Users can delete own RSVPs"
  on "public"."event_rsvps"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can insert own RSVPs"
  on "public"."event_rsvps"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update own RSVPs"
  on "public"."event_rsvps"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can delete tags for own events"
  on "public"."event_tag_assignments"
  as permissive
  for delete
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_tag_assignments.event_id) AND (events.creator_id = ( SELECT auth.uid() AS uid))))));



  create policy "Users can insert tags for own events"
  on "public"."event_tag_assignments"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_tag_assignments.event_id) AND (events.creator_id = ( SELECT auth.uid() AS uid))))));



  create policy "Users can update tags for own events"
  on "public"."event_tag_assignments"
  as permissive
  for update
  to public
using ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_tag_assignments.event_id) AND (events.creator_id = ( SELECT auth.uid() AS uid))))))
with check ((EXISTS ( SELECT 1
   FROM public.events
  WHERE ((events.id = event_tag_assignments.event_id) AND (events.creator_id = ( SELECT auth.uid() AS uid))))));



  create policy "Users can delete own gallery photos"
  on "public"."gallery_photos"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can insert own gallery photos"
  on "public"."gallery_photos"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update own gallery photos"
  on "public"."gallery_photos"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can delete own tags"
  on "public"."user_tag_assignments"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update own tags"
  on "public"."user_tag_assignments"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can create comments"
  on "public"."event_comments"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "Users can delete own comments"
  on "public"."event_comments"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "Users can view all event comments"
  on "public"."event_comments"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



  create policy "Users can view all RSVPs"
  on "public"."event_rsvps"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



  create policy "Users can view event tag assignments"
  on "public"."event_tag_assignments"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



  create policy "Users can view all event tags"
  on "public"."event_tags"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



  create policy "Users can create events"
  on "public"."events"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "Users can delete own events"
  on "public"."events"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "Users can update own events"
  on "public"."events"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "Users can view all events"
  on "public"."events"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



  create policy "Users can view all gallery photos"
  on "public"."gallery_photos"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



  create policy "Users can manage own tags"
  on "public"."user_tag_assignments"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can view all user tag assignments"
  on "public"."user_tag_assignments"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



  create policy "Users can view all user tags"
  on "public"."user_tags"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



  create policy "Users can update own profile"
  on "public"."users"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can view all profiles"
  on "public"."users"
  as permissive
  for select
  to public
using ((( SELECT auth.role() AS role) = 'authenticated'::text));



