CREATE TABLE gallery_photos (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    photo_path TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, photo_path)
);
