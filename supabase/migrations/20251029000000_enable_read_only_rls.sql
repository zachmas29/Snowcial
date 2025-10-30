-- Enable RLS on all tables and create read-only policies

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for anonymous users
CREATE POLICY "Public read access" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.user_tags
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.user_tag_assignments
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.event_tags
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.event_tag_assignments
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.event_comments
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.event_rsvps
    FOR SELECT USING (true);

CREATE POLICY "Public read access" ON public.gallery_photos
    FOR SELECT USING (true);