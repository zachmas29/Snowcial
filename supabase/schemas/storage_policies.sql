-- Storage bucket policies for user photos
-- Security model: Storage allows authenticated users to upload
-- The users table RLS ensures only profile owner can set photo_path
-- Gallery photos table RLS ensures only owner can create their own entries

-- Profile photos bucket - authenticated users can upload, anyone can view
CREATE POLICY "Authenticated users can upload profile photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Authenticated users can update profile photos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Authenticated users can delete profile photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Anyone can view profile photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');

-- Banner photos bucket - authenticated users can upload, anyone can view
CREATE POLICY "Authenticated users can upload banner photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'banner-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Authenticated users can update banner photos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'banner-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Authenticated users can delete banner photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'banner-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Anyone can view banner photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'banner-photos');

-- Gallery photos bucket - authenticated users can upload, anyone can view
CREATE POLICY "Authenticated users can upload gallery photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'gallery-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Authenticated users can update gallery photos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'gallery-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Authenticated users can delete gallery photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'gallery-photos' AND
        (select auth.role()) = 'authenticated'
    );

CREATE POLICY "Anyone can view gallery photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'gallery-photos');
