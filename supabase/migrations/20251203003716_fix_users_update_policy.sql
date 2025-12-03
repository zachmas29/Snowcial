drop policy "Users can update own comments" on "public"."event_comments";

drop policy "Users can view all event comments" on "public"."event_comments";

drop policy "Users can update own profile" on "public"."users";

alter table "public"."event_comments" drop constraint "event_comments_parent_comment_id_fkey";

alter table "public"."event_comments" drop column "is_deleted";

alter table "public"."event_comments" add constraint "event_comments_parent_comment_id_fkey" FOREIGN KEY (parent_comment_id) REFERENCES public.event_comments(id) ON DELETE CASCADE not valid;

alter table "public"."event_comments" validate constraint "event_comments_parent_comment_id_fkey";


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



  create policy "Users can update own profile"
  on "public"."users"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));



