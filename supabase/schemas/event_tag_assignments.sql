CREATE TABLE event_tag_assignments (
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES event_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_id)
);

CREATE INDEX ON event_tag_assignments(event_id); -- Efficient selection of an event's tags
CREATE INDEX ON event_tag_assignments(tag_id); -- Efficient selection of all the events that have a particular tag
