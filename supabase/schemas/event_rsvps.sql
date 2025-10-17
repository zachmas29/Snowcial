CREATE TYPE rsvp_status AS ENUM ('yes', 'maybe');

CREATE TABLE event_rsvps (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status rsvp_status NOT NULL,
    PRIMARY KEY (user_id, event_id)
);

CREATE INDEX event_rsvps_event_id_idx ON event_rsvps(event_id);
CREATE INDEX event_rsvps_user_id_idx ON event_rsvps(user_id);
