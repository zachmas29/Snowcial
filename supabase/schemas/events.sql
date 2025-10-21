CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    creator_id BIGINT NOT NULL REFERENCES users(id),
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
