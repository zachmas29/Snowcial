CREATE OR REPLACE FUNCTION update_last_updated_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.last_updated = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

-- Function to automatically create a public.users record when a new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    DECLARE
        full_name TEXT;
        name_parts TEXT[];
        first TEXT;
        last TEXT;
    BEGIN
        -- Get the full name from user metadata (Google OAuth provides this)
        full_name := NEW.raw_user_meta_data->>'name';

        -- Split name into first and last (Google provides "First Last" format)
        IF full_name IS NOT NULL THEN
            name_parts := string_to_array(full_name, ' ');
            first := name_parts[1];
            -- Last name is everything after first name
            IF array_length(name_parts, 1) > 1 THEN
                last := array_to_string(name_parts[2:array_length(name_parts, 1)], ' ');
            ELSE
                last := '';
            END IF;
        ELSE
            -- Fallback if name not provided
            first := 'User';
            last := '';
        END IF;

        -- Insert new user into public.users table
        INSERT INTO public.users (
            id,
            first_name,
            last_name,
            email,
            profile_photo_path,
            created_at,
            last_updated,
            last_active
        ) VALUES (
            NEW.id,
            first,
            last,
            NEW.email,
            NEW.raw_user_meta_data->>'avatar_url',
            NOW(),
            NOW(),
            NOW()
        );

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user when a new user signs up via auth
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    nick_name TEXT,
    bio_text TEXT,
    profile_photo_path TEXT,
    banner_photo_path TEXT
);

CREATE INDEX users_email_idx ON users(email);

CREATE TRIGGER update_users_last_updated
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_column();
CREATE TABLE user_tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_time TIMESTAMPTZ NOT NULL,
    title TEXT NOT NULL,
    description TEXT
);

CREATE INDEX events_creator_id_idx ON events(creator_id);
CREATE INDEX events_event_time_idx ON events(event_time);

CREATE TRIGGER update_events_last_updated
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_column();
CREATE TABLE event_tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);
CREATE TABLE event_comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    comment_text TEXT NOT NULL
);

CREATE INDEX event_comments_event_id_idx ON event_comments(event_id);
CREATE TYPE rsvp_status AS ENUM ('yes', 'maybe');

CREATE TABLE event_rsvps (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status rsvp_status NOT NULL,
    PRIMARY KEY (user_id, event_id)
);

CREATE INDEX event_rsvps_event_id_idx ON event_rsvps(event_id);
CREATE INDEX event_rsvps_user_id_idx ON event_rsvps(user_id);
CREATE TABLE event_tag_assignments (
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES event_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_id)
);

CREATE INDEX ON event_tag_assignments(event_id); -- Efficient selection of an event's tags
CREATE INDEX ON event_tag_assignments(tag_id); -- Efficient selection of all the events that have a particular tag
CREATE TABLE gallery_photos (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    photo_path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, photo_path)
);
CREATE TABLE user_tag_assignments (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES user_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, tag_id)
);

CREATE INDEX ON user_tag_assignments(user_id); -- Efficient selection of a user's tags
CREATE INDEX ON user_tag_assignments(tag_id); -- Efficient selection of all the users who have a particular tag
-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all profiles"
    ON users FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- User tags policies (read-only for all authenticated users)
CREATE POLICY "Users can view all user tags"
    ON user_tags FOR SELECT
    USING (auth.role() = 'authenticated');

-- User tag assignments policies
CREATE POLICY "Users can view all user tag assignments"
    ON user_tag_assignments FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own tags"
    ON user_tag_assignments FOR ALL
    USING (auth.uid() = user_id);

-- Events policies
CREATE POLICY "Users can view all events"
    ON events FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own events"
    ON events FOR UPDATE
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own events"
    ON events FOR DELETE
    USING (auth.uid() = creator_id);

-- Event tags policies (read-only for all authenticated users)
CREATE POLICY "Users can view all event tags"
    ON event_tags FOR SELECT
    USING (auth.role() = 'authenticated');

-- Event tag assignments policies
CREATE POLICY "Users can view event tag assignments"
    ON event_tag_assignments FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage tags for own events"
    ON event_tag_assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = event_tag_assignments.event_id
            AND events.creator_id = auth.uid()
        )
    );

-- Event comments policies
CREATE POLICY "Users can view all event comments"
    ON event_comments FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create comments"
    ON event_comments FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can delete own comments"
    ON event_comments FOR DELETE
    USING (auth.uid() = creator_id);

-- Event RSVPs policies
CREATE POLICY "Users can view all RSVPs"
    ON event_rsvps FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own RSVPs"
    ON event_rsvps FOR ALL
    USING (auth.uid() = user_id);

-- Gallery photos policies
CREATE POLICY "Users can view all gallery photos"
    ON gallery_photos FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own gallery photos"
    ON gallery_photos FOR ALL
    USING (auth.uid() = user_id);
