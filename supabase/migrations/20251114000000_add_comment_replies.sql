alter table public.event_comments
  add column parent_comment_id bigint references public.event_comments(id) on delete cascade;

create index if not exists event_comments_parent_comment_id_idx
  on public.event_comments(parent_comment_id);

alter table public.event_comments
  add constraint event_comments_parent_same_event
  check (
    parent_comment_id is null
    or event_id = (
      select event_id from public.event_comments parent where parent.id = parent_comment_id
    )
  );
