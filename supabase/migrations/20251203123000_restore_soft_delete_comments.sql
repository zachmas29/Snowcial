alter table public.event_comments
  add column if not exists is_deleted boolean not null default false;

-- Preserve replies when a parent comment is removed
alter table public.event_comments
  drop constraint if exists event_comments_parent_comment_id_fkey;

alter table public.event_comments
  add constraint event_comments_parent_comment_id_fkey
    foreign key (parent_comment_id)
    references public.event_comments(id)
    on delete set null;

-- Restore soft-delete style policies
drop policy if exists "Users can delete own comments" on public.event_comments;
drop policy if exists "Users can view all event comments" on public.event_comments;
drop policy if exists "Users can update own comments" on public.event_comments;

create policy "Users can view all event comments"
  on public.event_comments
  as permissive
  for select
  to public
  using (true);

create policy "Users can update own comments"
  on public.event_comments
  as permissive
  for update
  to public
  using (((select auth.uid() as uid) = creator_id))
  with check (((select auth.uid() as uid) = creator_id));
