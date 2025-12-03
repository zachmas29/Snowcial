CREATE TABLE event_comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    parent_comment_id BIGINT REFERENCES event_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    comment_text TEXT NOT NULL
);

CREATE INDEX event_comments_event_id_idx ON event_comments(event_id);
CREATE INDEX event_comments_parent_comment_id_idx ON event_comments(parent_comment_id);
