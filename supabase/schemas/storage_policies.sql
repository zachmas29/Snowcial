-- Storage bucket policies for user photos
-- Security model: Storage allows users to upload only their own photos
-- The users table RLS ensures only profile owner can set photo_path
-- Gallery photos table RLS ensures only owner can create their own entries

-- Profile photos bucket - users can upload own, anyone can view
CREATE POLICY "Users can upload own profile photos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'profile-photos' AND
        name LIKE (auth.uid()::text || '-%')
    );

CREATE POLICY "Anyone can view profile photos"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'profile-photos');

-- Banner photos bucket - users can upload own, anyone can view
CREATE POLICY "Users can upload own banner photos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'banner-photos' AND
        name LIKE (auth.uid()::text || '-%')
    );

CREATE POLICY "Anyone can view banner photos"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'banner-photos');

-- Gallery photos bucket - users can upload own, anyone can view
CREATE POLICY "Users can upload own gallery photos"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'gallery-photos' AND
        name LIKE (auth.uid()::text || '-%')
    );

CREATE POLICY "Anyone can view gallery photos"
    ON storage.objects FOR SELECT TO public
    USING (bucket_id = 'gallery-photos');
