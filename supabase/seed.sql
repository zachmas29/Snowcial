-- Insert test users
insert into users (first_name, last_name, email, nick_name, bio_text, profile_photo_path, banner_photo_path)
values
  ('Emma', 'Johnson', 'emma.johnson@middlebury.edu', 'EmmaJ', 'Love hitting the slopes early morning! Always looking for powder days at Snowbowl.', '/profiles/emma_profile.jpg', '/banners/emma_banner.jpg'),
  ('Jake', 'Martinez', 'jake.martinez@middlebury.edu', 'JakeM', 'Snowboarder for 5 years. Down for park laps or backcountry adventures.', '/profiles/jake_profile.jpg', '/banners/jake_banner.jpg'),
  ('Sarah', 'Chen', 'sarah.chen@middlebury.edu', 'SarahC', 'Just learned to ski last year, looking for beginner-friendly group rides!', '/profiles/sarah_profile.jpg', '/banners/sarah_banner.jpg'),
  ('Mike', 'Anderson', 'mike.anderson@middlebury.edu', 'MikeA', 'Instructor at Sugar Bush on weekends. Happy to give tips to anyone!', '/profiles/mike_profile.jpg', '/banners/mike_banner.jpg'),
  ('Lily', 'Thompson', 'lily.thompson@middlebury.edu', 'LilyT', 'Avid skier, love cruising blues and the occasional black diamond. Sugar Bush regular!', '/profiles/lily_profile.jpg', '/banners/lily_banner.jpg');

-- Insert event tags
insert into event_tags (name)
values
  ('Snowbowl'),
  ('Sugar Bush');

-- Insert user tags
insert into user_tags (name)
values
  ('Beginner'),
  ('Skier'),
  ('Snowboarder');

-- Insert test events
insert into events (creator_id, event_time, title, description)
values
  (1, '2025-11-15 09:00:00-05', 'Morning Powder Run at Snowbowl', 'Fresh snow expected tonight! Let''s meet at the base lodge at 9am for first tracks. All levels welcome, we''ll split into groups by ability.'),
  (4, '2025-11-22 13:00:00-05', 'Afternoon Session at Sugar Bush', 'Casual afternoon skiing/boarding at Sugar Bush. Planning to hit Lincoln Peak and explore some tree runs. Intermediates and above preferred.');

-- Insert event comments
insert into event_comments (creator_id, event_id, comment_text)
values
  (2, 1, 'Count me in! Should I bring hot chocolate to share?'),
  (3, 1, 'This will be my first time at Snowbowl, super excited!'),
  (1, 2, 'Love Sugar Bush! Will the conditions be good for intermediates?'),
  (5, 2, 'I''m planning to go! Maybe we can hit Heaven''s Gate if the group is up for it.');

-- Insert event RSVPs
insert into event_rsvps (user_id, event_id, status)
values
  (1, 1, 'yes'),
  (2, 1, 'yes'),
  (3, 1, 'yes'),
  (4, 2, 'yes'),
  (5, 2, 'yes'),
  (1, 2, 'maybe'),
  (2, 2, 'maybe');

-- Insert gallery photos (2 per user)
insert into gallery_photos (user_id, photo_path)
values
  (1, '/gallery/emma_snowbowl_1.jpg'),
  (1, '/gallery/emma_sugarbush_sunset.jpg'),
  (2, '/gallery/jake_park_jump.jpg'),
  (2, '/gallery/jake_backcountry.jpg'),
  (3, '/gallery/sarah_first_run.jpg'),
  (3, '/gallery/sarah_bunny_slope.jpg'),
  (4, '/gallery/mike_teaching.jpg'),
  (4, '/gallery/mike_powder_day.jpg'),
  (5, '/gallery/lily_mountain_view.jpg'),
  (5, '/gallery/lily_group_photo.jpg');

-- Insert event tag assignments
insert into event_tag_assignments (event_id, tag_id)
values
  (1, 1),  -- Event 1 tagged with Snowbowl
  (2, 2);  -- Event 2 tagged with Sugar Bush

-- Insert user tag assignments
insert into user_tag_assignments (user_id, tag_id)
values
  (1, 2),  -- Emma is a Skier
  (2, 3),  -- Jake is a Snowboarder
  (3, 1),  -- Sarah is a Beginner
  (3, 2),  -- Sarah is a Skier
  (4, 2),  -- Mike is a Skier
  (5, 2);  -- Lily is a Skier
