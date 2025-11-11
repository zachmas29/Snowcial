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
