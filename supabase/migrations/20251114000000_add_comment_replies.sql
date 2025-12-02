alter table public.event_comments
  add column parent_comment_id bigint references public.event_comments(id) on delete cascade;

create index if not exists event_comments_parent_comment_id_idx
  on public.event_comments(parent_comment_id);
