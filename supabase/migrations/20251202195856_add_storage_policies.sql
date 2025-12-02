-- Add storage bucket policies for user photos
-- These policies ensure users can only manage their own photos
-- File naming convention: {userId}-{timestamp}-{filename}

-- Profile photos bucket policies
CREATE POLICY "Users can upload own profile photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'profile-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Users can update own profile photos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'profile-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Users can delete own profile photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'profile-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Anyone can view profile photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'profile-photos');

-- Banner photos bucket policies
CREATE POLICY "Users can upload own banner photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'banner-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Users can update own banner photos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'banner-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Users can delete own banner photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'banner-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Anyone can view banner photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'banner-photos');

-- Gallery photos bucket policies
CREATE POLICY "Users can upload own gallery photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'gallery-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Users can update own gallery photos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'gallery-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Users can delete own gallery photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'gallery-photos' AND
        (select auth.uid())::text = (string_to_array(name, '-'))[1]
    );

CREATE POLICY "Anyone can view gallery photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'gallery-photos');
