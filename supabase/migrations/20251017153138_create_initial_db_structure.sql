create type "public"."rsvp_status" as enum ('yes', 'maybe');

create table "public"."event_comments" (
    "id" bigint generated always as identity not null,
    "creator_id" bigint not null,
    "event_id" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "comment_text" text not null
);


create table "public"."event_rsvps" (
    "user_id" bigint not null,
    "event_id" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "status" rsvp_status not null
);


create table "public"."event_tag_assignments" (
    "event_id" bigint not null,
    "tag_id" bigint not null
);


create table "public"."event_tags" (
    "id" bigint generated always as identity not null,
    "name" text not null
);


create table "public"."events" (
    "id" bigint generated always as identity not null,
    "creator_id" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "last_updated" timestamp with time zone not null default now(),
    "event_time" timestamp with time zone not null,
    "title" text not null,
    "description" text
);


create table "public"."gallery_photos" (
    "user_id" bigint not null,
    "photo_path" text not null,
    "created_at" timestamp with time zone not null default now()
);


create table "public"."user_tag_assignments" (
    "user_id" bigint not null,
    "tag_id" bigint not null
);


create table "public"."user_tags" (
    "id" bigint generated always as identity not null,
    "name" text not null
);


create table "public"."users" (
    "id" bigint generated always as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "last_updated" timestamp with time zone not null default now(),
    "last_active" timestamp with time zone not null default now(),
    "first_name" text not null,
    "last_name" text not null,
    "email" text not null,
    "nick_name" text,
    "bio_text" text,
    "profile_photo_path" text,
    "banner_photo_path" text
);


CREATE INDEX event_comments_event_id_idx ON public.event_comments USING btree (event_id);

CREATE UNIQUE INDEX event_comments_pkey ON public.event_comments USING btree (id);

CREATE INDEX event_rsvps_event_id_idx ON public.event_rsvps USING btree (event_id);

CREATE UNIQUE INDEX event_rsvps_pkey ON public.event_rsvps USING btree (user_id, event_id);

CREATE INDEX event_rsvps_user_id_idx ON public.event_rsvps USING btree (user_id);

CREATE INDEX event_tag_assignments_event_id_idx ON public.event_tag_assignments USING btree (event_id);

CREATE UNIQUE INDEX event_tag_assignments_pkey ON public.event_tag_assignments USING btree (event_id, tag_id);

CREATE INDEX event_tag_assignments_tag_id_idx ON public.event_tag_assignments USING btree (tag_id);

CREATE UNIQUE INDEX event_tags_name_key ON public.event_tags USING btree (name);

CREATE UNIQUE INDEX event_tags_pkey ON public.event_tags USING btree (id);

CREATE INDEX events_creator_id_idx ON public.events USING btree (creator_id);

CREATE INDEX events_event_time_idx ON public.events USING btree (event_time);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX gallery_photos_pkey ON public.gallery_photos USING btree (user_id, photo_path);

CREATE UNIQUE INDEX user_tag_assignments_pkey ON public.user_tag_assignments USING btree (user_id, tag_id);

CREATE INDEX user_tag_assignments_tag_id_idx ON public.user_tag_assignments USING btree (tag_id);

CREATE INDEX user_tag_assignments_user_id_idx ON public.user_tag_assignments USING btree (user_id);

CREATE UNIQUE INDEX user_tags_name_key ON public.user_tags USING btree (name);

CREATE UNIQUE INDEX user_tags_pkey ON public.user_tags USING btree (id);

CREATE INDEX users_email_idx ON public.users USING btree (email);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."event_comments" add constraint "event_comments_pkey" PRIMARY KEY using index "event_comments_pkey";

alter table "public"."event_rsvps" add constraint "event_rsvps_pkey" PRIMARY KEY using index "event_rsvps_pkey";

alter table "public"."event_tag_assignments" add constraint "event_tag_assignments_pkey" PRIMARY KEY using index "event_tag_assignments_pkey";

alter table "public"."event_tags" add constraint "event_tags_pkey" PRIMARY KEY using index "event_tags_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."gallery_photos" add constraint "gallery_photos_pkey" PRIMARY KEY using index "gallery_photos_pkey";

alter table "public"."user_tag_assignments" add constraint "user_tag_assignments_pkey" PRIMARY KEY using index "user_tag_assignments_pkey";

alter table "public"."user_tags" add constraint "user_tags_pkey" PRIMARY KEY using index "user_tags_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."event_comments" add constraint "event_comments_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."event_comments" validate constraint "event_comments_creator_id_fkey";

alter table "public"."event_comments" add constraint "event_comments_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE not valid;

alter table "public"."event_comments" validate constraint "event_comments_event_id_fkey";

alter table "public"."event_rsvps" add constraint "event_rsvps_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE not valid;

alter table "public"."event_rsvps" validate constraint "event_rsvps_event_id_fkey";

alter table "public"."event_rsvps" add constraint "event_rsvps_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."event_rsvps" validate constraint "event_rsvps_user_id_fkey";

alter table "public"."event_tag_assignments" add constraint "event_tag_assignments_event_id_fkey" FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE not valid;

alter table "public"."event_tag_assignments" validate constraint "event_tag_assignments_event_id_fkey";

alter table "public"."event_tag_assignments" add constraint "event_tag_assignments_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES event_tags(id) ON DELETE CASCADE not valid;

alter table "public"."event_tag_assignments" validate constraint "event_tag_assignments_tag_id_fkey";

alter table "public"."event_tags" add constraint "event_tags_name_key" UNIQUE using index "event_tags_name_key";

alter table "public"."events" add constraint "events_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES users(id) not valid;

alter table "public"."events" validate constraint "events_creator_id_fkey";

alter table "public"."gallery_photos" add constraint "gallery_photos_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."gallery_photos" validate constraint "gallery_photos_user_id_fkey";

alter table "public"."user_tag_assignments" add constraint "user_tag_assignments_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES user_tags(id) ON DELETE CASCADE not valid;

alter table "public"."user_tag_assignments" validate constraint "user_tag_assignments_tag_id_fkey";

alter table "public"."user_tag_assignments" add constraint "user_tag_assignments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_tag_assignments" validate constraint "user_tag_assignments_user_id_fkey";

alter table "public"."user_tags" add constraint "user_tags_name_key" UNIQUE using index "user_tags_name_key";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_last_updated_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    BEGIN
        NEW.last_updated = NOW();
        RETURN NEW;
    END;
    $function$
;

grant delete on table "public"."event_comments" to "anon";

grant insert on table "public"."event_comments" to "anon";

grant references on table "public"."event_comments" to "anon";

grant select on table "public"."event_comments" to "anon";

grant trigger on table "public"."event_comments" to "anon";

grant truncate on table "public"."event_comments" to "anon";

grant update on table "public"."event_comments" to "anon";

grant delete on table "public"."event_comments" to "authenticated";

grant insert on table "public"."event_comments" to "authenticated";

grant references on table "public"."event_comments" to "authenticated";

grant select on table "public"."event_comments" to "authenticated";

grant trigger on table "public"."event_comments" to "authenticated";

grant truncate on table "public"."event_comments" to "authenticated";

grant update on table "public"."event_comments" to "authenticated";

grant delete on table "public"."event_comments" to "service_role";

grant insert on table "public"."event_comments" to "service_role";

grant references on table "public"."event_comments" to "service_role";

grant select on table "public"."event_comments" to "service_role";

grant trigger on table "public"."event_comments" to "service_role";

grant truncate on table "public"."event_comments" to "service_role";

grant update on table "public"."event_comments" to "service_role";

grant delete on table "public"."event_rsvps" to "anon";

grant insert on table "public"."event_rsvps" to "anon";

grant references on table "public"."event_rsvps" to "anon";

grant select on table "public"."event_rsvps" to "anon";

grant trigger on table "public"."event_rsvps" to "anon";

grant truncate on table "public"."event_rsvps" to "anon";

grant update on table "public"."event_rsvps" to "anon";

grant delete on table "public"."event_rsvps" to "authenticated";

grant insert on table "public"."event_rsvps" to "authenticated";

grant references on table "public"."event_rsvps" to "authenticated";

grant select on table "public"."event_rsvps" to "authenticated";

grant trigger on table "public"."event_rsvps" to "authenticated";

grant truncate on table "public"."event_rsvps" to "authenticated";

grant update on table "public"."event_rsvps" to "authenticated";

grant delete on table "public"."event_rsvps" to "service_role";

grant insert on table "public"."event_rsvps" to "service_role";

grant references on table "public"."event_rsvps" to "service_role";

grant select on table "public"."event_rsvps" to "service_role";

grant trigger on table "public"."event_rsvps" to "service_role";

grant truncate on table "public"."event_rsvps" to "service_role";

grant update on table "public"."event_rsvps" to "service_role";

grant delete on table "public"."event_tag_assignments" to "anon";

grant insert on table "public"."event_tag_assignments" to "anon";

grant references on table "public"."event_tag_assignments" to "anon";

grant select on table "public"."event_tag_assignments" to "anon";

grant trigger on table "public"."event_tag_assignments" to "anon";

grant truncate on table "public"."event_tag_assignments" to "anon";

grant update on table "public"."event_tag_assignments" to "anon";

grant delete on table "public"."event_tag_assignments" to "authenticated";

grant insert on table "public"."event_tag_assignments" to "authenticated";

grant references on table "public"."event_tag_assignments" to "authenticated";

grant select on table "public"."event_tag_assignments" to "authenticated";

grant trigger on table "public"."event_tag_assignments" to "authenticated";

grant truncate on table "public"."event_tag_assignments" to "authenticated";

grant update on table "public"."event_tag_assignments" to "authenticated";

grant delete on table "public"."event_tag_assignments" to "service_role";

grant insert on table "public"."event_tag_assignments" to "service_role";

grant references on table "public"."event_tag_assignments" to "service_role";

grant select on table "public"."event_tag_assignments" to "service_role";

grant trigger on table "public"."event_tag_assignments" to "service_role";

grant truncate on table "public"."event_tag_assignments" to "service_role";

grant update on table "public"."event_tag_assignments" to "service_role";

grant delete on table "public"."event_tags" to "anon";

grant insert on table "public"."event_tags" to "anon";

grant references on table "public"."event_tags" to "anon";

grant select on table "public"."event_tags" to "anon";

grant trigger on table "public"."event_tags" to "anon";

grant truncate on table "public"."event_tags" to "anon";

grant update on table "public"."event_tags" to "anon";

grant delete on table "public"."event_tags" to "authenticated";

grant insert on table "public"."event_tags" to "authenticated";

grant references on table "public"."event_tags" to "authenticated";

grant select on table "public"."event_tags" to "authenticated";

grant trigger on table "public"."event_tags" to "authenticated";

grant truncate on table "public"."event_tags" to "authenticated";

grant update on table "public"."event_tags" to "authenticated";

grant delete on table "public"."event_tags" to "service_role";

grant insert on table "public"."event_tags" to "service_role";

grant references on table "public"."event_tags" to "service_role";

grant select on table "public"."event_tags" to "service_role";

grant trigger on table "public"."event_tags" to "service_role";

grant truncate on table "public"."event_tags" to "service_role";

grant update on table "public"."event_tags" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."gallery_photos" to "anon";

grant insert on table "public"."gallery_photos" to "anon";

grant references on table "public"."gallery_photos" to "anon";

grant select on table "public"."gallery_photos" to "anon";

grant trigger on table "public"."gallery_photos" to "anon";

grant truncate on table "public"."gallery_photos" to "anon";

grant update on table "public"."gallery_photos" to "anon";

grant delete on table "public"."gallery_photos" to "authenticated";

grant insert on table "public"."gallery_photos" to "authenticated";

grant references on table "public"."gallery_photos" to "authenticated";

grant select on table "public"."gallery_photos" to "authenticated";

grant trigger on table "public"."gallery_photos" to "authenticated";

grant truncate on table "public"."gallery_photos" to "authenticated";

grant update on table "public"."gallery_photos" to "authenticated";

grant delete on table "public"."gallery_photos" to "service_role";

grant insert on table "public"."gallery_photos" to "service_role";

grant references on table "public"."gallery_photos" to "service_role";

grant select on table "public"."gallery_photos" to "service_role";

grant trigger on table "public"."gallery_photos" to "service_role";

grant truncate on table "public"."gallery_photos" to "service_role";

grant update on table "public"."gallery_photos" to "service_role";

grant delete on table "public"."user_tag_assignments" to "anon";

grant insert on table "public"."user_tag_assignments" to "anon";

grant references on table "public"."user_tag_assignments" to "anon";

grant select on table "public"."user_tag_assignments" to "anon";

grant trigger on table "public"."user_tag_assignments" to "anon";

grant truncate on table "public"."user_tag_assignments" to "anon";

grant update on table "public"."user_tag_assignments" to "anon";

grant delete on table "public"."user_tag_assignments" to "authenticated";

grant insert on table "public"."user_tag_assignments" to "authenticated";

grant references on table "public"."user_tag_assignments" to "authenticated";

grant select on table "public"."user_tag_assignments" to "authenticated";

grant trigger on table "public"."user_tag_assignments" to "authenticated";

grant truncate on table "public"."user_tag_assignments" to "authenticated";

grant update on table "public"."user_tag_assignments" to "authenticated";

grant delete on table "public"."user_tag_assignments" to "service_role";

grant insert on table "public"."user_tag_assignments" to "service_role";

grant references on table "public"."user_tag_assignments" to "service_role";

grant select on table "public"."user_tag_assignments" to "service_role";

grant trigger on table "public"."user_tag_assignments" to "service_role";

grant truncate on table "public"."user_tag_assignments" to "service_role";

grant update on table "public"."user_tag_assignments" to "service_role";

grant delete on table "public"."user_tags" to "anon";

grant insert on table "public"."user_tags" to "anon";

grant references on table "public"."user_tags" to "anon";

grant select on table "public"."user_tags" to "anon";

grant trigger on table "public"."user_tags" to "anon";

grant truncate on table "public"."user_tags" to "anon";

grant update on table "public"."user_tags" to "anon";

grant delete on table "public"."user_tags" to "authenticated";

grant insert on table "public"."user_tags" to "authenticated";

grant references on table "public"."user_tags" to "authenticated";

grant select on table "public"."user_tags" to "authenticated";

grant trigger on table "public"."user_tags" to "authenticated";

grant truncate on table "public"."user_tags" to "authenticated";

grant update on table "public"."user_tags" to "authenticated";

grant delete on table "public"."user_tags" to "service_role";

grant insert on table "public"."user_tags" to "service_role";

grant references on table "public"."user_tags" to "service_role";

grant select on table "public"."user_tags" to "service_role";

grant trigger on table "public"."user_tags" to "service_role";

grant truncate on table "public"."user_tags" to "service_role";

grant update on table "public"."user_tags" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

CREATE TRIGGER update_events_last_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();

CREATE TRIGGER update_users_last_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();


