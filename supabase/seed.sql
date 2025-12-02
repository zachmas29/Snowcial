-- Seed data to simulate Google OAuth users
-- These UUIDs simulate what would come from auth.users

-- Insert test users with UUIDs (simulating auth.users.id)
insert into users (id, first_name, last_name, email, nick_name, bio_text, profile_photo_path, banner_photo_path)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Emma', 'Johnson', 'emma.johnson@middlebury.edu', 'EmmaJ', 'Love hitting the slopes early morning! Always looking for powder days at Snowbowl.', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Jake', 'Martinez', 'jake.martinez@middlebury.edu', 'JakeM', 'Snowboarder for 5 years. Down for park laps or backcountry adventures.', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Sarah', 'Chen', 'sarah.chen@middlebury.edu', 'SarahC', 'Just learned to ski last year, looking for beginner-friendly group rides!', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Alex', 'Thompson', 'alex.thompson@middlebury.edu', 'AlexT', 'Backcountry enthusiast and avalanche safety instructor. Let''s explore the sidecountry!', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Maya', 'Patel', 'maya.patel@middlebury.edu', 'MayaP', 'Weekend warrior! Love cruising blues at Sugarbush. Coffee before every run.', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Chris', 'Anderson', 'chris.anderson@middlebury.edu', 'ChrisA', 'Former ski racer, now just here for a good time. Fast and smooth.', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'Zoe', 'Williams', 'zoe.williams@middlebury.edu', 'ZoeW', 'New to Vermont! Stoked to explore all the mountains. Night skiing anyone?', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'Ryan', 'Kim', 'ryan.kim@middlebury.edu', 'RyanK', 'Photographer and skier. Always chasing the best light and freshest snow.', 'https://lh3.googleusercontent.com/a/default-user', null),
  ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'Lily', 'Rodriguez', 'lily.rodriguez@middlebury.edu', 'LilyR', 'Ski patrol volunteer. Safety first, fun always! Killington is my home mountain.', 'https://lh3.googleusercontent.com/a/default-user', null);

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
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '2025-11-22 13:00:00-05', 'Park Session at Snowbowl', 'Hitting the terrain park this weekend. Looking for fellow park riders to session with. Bring your A-game!'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2025-11-16 10:00:00-05', 'Sugarbush Sunday Cruisers', 'Casual day at Sugarbush! Planning to stick to blue runs and grab lunch at the mid-mountain lodge. Perfect for intermediates.'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '2025-11-18 08:00:00-05', 'Backcountry Tour at Stowe', 'Experienced backcountry skiers only. We''ll tour up from the resort and explore some sidecountry zones. Beacon, shovel, probe required.'),
  ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', '2025-11-23 11:00:00-05', 'Killington Mogul Bash', 'Let''s hit the bumps at Killington! Looking for advanced skiers who want to work on mogul technique. Outer Limits awaits!'),
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', '2025-11-24 18:00:00-05', 'Night Skiing at Snowbowl', 'First night skiing session of the season! Meet at 6pm for some twilight turns under the lights. Hot chocolate after!');

-- Insert event comments
insert into event_comments (creator_id, event_id, comment_text)
values
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 1, 'Count me in! Should I bring hot chocolate to share?'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1, 'This will be my first time at Snowbowl, super excited!'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'I might stop by for a bit! Still learning park tricks.'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 3, 'I''ll be there! Love those Sugarbush blues.'),
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 3, 'Perfect timing! I''ve been wanting to get some photos at Sugarbush.'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 3, 'Can I tag along? Still building confidence on blues.'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 4, 'Wish I could join but my backcountry skills aren''t there yet. Have fun and stay safe!'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 5, 'Moguls are not my thing but good luck everyone!'),
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 6, 'I''m so pumped for this! My first night skiing experience!'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 6, 'Can we make this a regular thing? Night skiing is the best!');

-- Insert threaded replies for event comments
insert into event_comments (creator_id, event_id, comment_text, parent_comment_id)
values
  (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    1,
    'Hot chocolate sounds amazing!',
    (select id from event_comments where event_id = 1 and creator_id = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22' limit 1)
  ),
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    1,
    'Welcome! Happy to show you around.',
    (select id from event_comments where event_id = 1 and creator_id = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33' limit 1)
  ),
  (
    '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88',
    3,
    'Bring your camera, Ryan! Sunrise shots would be great.',
    (select id from event_comments where event_id = 3 and creator_id = '20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88' limit 1)
  );

-- Insert event RSVPs
insert into event_rsvps (user_id, event_id, status)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'yes'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 1, 'yes'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1, 'yes'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 2, 'yes'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'maybe'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 3, 'yes'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 3, 'yes'),
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 3, 'yes'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 3, 'yes'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 4, 'yes'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 4, 'maybe'),
  ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 5, 'yes'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 5, 'yes'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 5, 'maybe'),
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 6, 'yes'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 6, 'yes'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 6, 'yes'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 6, 'maybe');

-- Insert gallery photos
insert into gallery_photos (user_id, photo_path)
values
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256'),
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'https://images.unsplash.com/photo-1605540436563-5bca919ae766'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'https://images.unsplash.com/photo-1580913428023-170314c2ca5a'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'https://images.unsplash.com/photo-1571770095687-1d8c94ed94a0'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'https://images.unsplash.com/photo-1517649763962-0c623066013b'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'https://images.unsplash.com/photo-1547447134-cd3f5c716030'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e'),
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'https://images.unsplash.com/photo-1498146831523-fbe41acdc5ad'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'https://images.unsplash.com/photo-1565992441121-4367c2967103'),
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'https://images.unsplash.com/photo-1483381719261-39f9d0a6e4df'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'https://images.unsplash.com/photo-1605540436563-5bca919ae766'),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5'),
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'https://images.unsplash.com/photo-1551524559-8af4e6624178'),
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 'https://images.unsplash.com/photo-1609096458733-95b38583ac4e'),
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'https://images.unsplash.com/photo-1547732926-c2c2e562e1e7'),
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c'),
  ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c'),
  ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 'https://images.unsplash.com/photo-1551524164-687a55dd1126');

-- Insert event tag assignments
insert into event_tag_assignments (event_id, tag_id)
values
  (1, 1),  -- Event 1 tagged with Snowbowl
  (2, 1),  -- Event 2 tagged with Snowbowl
  (3, 2),  -- Event 3 tagged with Sugarbush
  (4, 4),  -- Event 4 tagged with Stowe
  (5, 3),  -- Event 5 tagged with Killington
  (6, 1);  -- Event 6 tagged with Snowbowl

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
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1),  -- Sarah is a Beginner
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 4),  -- Alex is a Skier
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 3),  -- Alex is Advanced
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 6),  -- Alex is Backcountry
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 4),  -- Maya is a Skier
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 2),  -- Maya is Intermediate
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 9),  -- Maya is Weekend Warrior
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 4),  -- Chris is a Skier
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 3),  -- Chris is Advanced
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 4),  -- Zoe is a Skier
  ('10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77', 2),  -- Zoe is Intermediate
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 4),  -- Ryan is a Skier
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 3),  -- Ryan is Advanced
  ('20eebc99-9c0b-4ef8-bb6d-6bb9bd380a88', 8),  -- Ryan is Early Bird
  ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 4),  -- Lily is a Skier
  ('30eebc99-9c0b-4ef8-bb6d-6bb9bd380a99', 3);  -- Lily is Advanced
