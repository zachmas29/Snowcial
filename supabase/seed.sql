-- Seed data to simulate Google OAuth users
-- These UUIDs simulate what would come from auth.users

-- Insert test users with UUIDs (simulating auth.users.id)
insert into users (id, first_name, last_name, email, nick_name, bio_text, profile_photo_path, banner_photo_path)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Emma', 'Johnson', 'emma.johnson@middlebury.edu', 'EmmaJ', 'Love hitting the slopes early morning! Always looking for powder days at Snowbowl.', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Jake', 'Martinez', 'jake.martinez@middlebury.edu', 'JakeM', 'Snowboarder for 5 years. Down for park laps or backcountry adventures.', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Sarah', 'Chen', 'sarah.chen@middlebury.edu', 'SarahC', 'Just learned to ski last year, looking for beginner-friendly group rides!', 'https://lh3.googleusercontent.com/a/default-user', null);

-- Insert event tags
insert into event_tags (name)
values
  ('Snowbowl'),
  ('Sugarbush'),
  ('Killington'),
  ('Stowe');

-- Insert user tags
insert into user_tags (name)
values
  ('Beginner'),
  ('Intermediate'),
  ('Advanced'),
  ('Skier'),
  ('Snowboarder'),
  ('Backcountry'),
  ('Park'),
  ('Early Bird'),
  ('Weekend Warrior');

-- Insert test events
insert into events (creator_id, event_time, title, description)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-11-15 09:00:00-05', 'Morning Powder Run at Snowbowl', 'Fresh snow expected tonight! Let''s meet at the base lodge at 9am for first tracks. All levels welcome, we''ll split into groups by ability.'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-11-22 13:00:00-05', 'Park Session at Snowbowl', 'Hitting the terrain park this weekend. Looking for fellow park riders to session with. Bring your A-game!');

-- Insert event comments
insert into event_comments (creator_id, event_id, comment_text)
values
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 1, 'Count me in! Should I bring hot chocolate to share?'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1, 'This will be my first time at Snowbowl, super excited!'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'I might stop by for a bit! Still learning park tricks.');

-- Insert event RSVPs
insert into event_rsvps (user_id, event_id, status)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'yes'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 1, 'yes'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1, 'yes'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 2, 'yes'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'maybe');

-- Insert gallery photos
insert into gallery_photos (user_id, photo_path)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'https://images.unsplash.com/photo-1605540436563-5bca919ae766'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'https://images.unsplash.com/photo-1580913428023-170314c2ca5a'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'https://images.unsplash.com/photo-1571770095687-1d8c94ed94a0'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'https://images.unsplash.com/photo-1517649763962-0c623066013b'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'https://images.unsplash.com/photo-1547447134-cd3f5c716030');

-- Insert event tag assignments
insert into event_tag_assignments (event_id, tag_id)
values
  (1, 1),  -- Event 1 tagged with Snowbowl
  (2, 1);  -- Event 2 tagged with Snowbowl

-- Insert user tag assignments
insert into user_tag_assignments (user_id, tag_id)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4),  -- Emma is a Skier
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2),  -- Emma is Intermediate
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 8),  -- Emma is Early Bird
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 5),  -- Jake is a Snowboarder
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 3),  -- Jake is Advanced
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 7),  -- Jake likes Park
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 4),  -- Sarah is a Skier
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1);  -- Sarah is a Beginner
