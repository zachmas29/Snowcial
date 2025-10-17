CREATE TABLE user_tag_assignments (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES user_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, tag_id)
);

CREATE INDEX ON user_tag_assignments(user_id); -- Efficient selection of a user's tags
CREATE INDEX ON user_tag_assignments(tag_id); -- Efficient selection of all the users who have a particular tag
