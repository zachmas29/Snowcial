CREATE OR REPLACE FUNCTION update_last_updated_column()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SET search_path = ''
AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$;

-- Function to automatically create a public.users record when a new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
AS $$
DECLARE
    full_name TEXT;
    name_parts TEXT[];
    first TEXT;
    last TEXT;
BEGIN
    -- Get the full name from user metadata (Google OAuth provides this)
    full_name := NEW.raw_user_meta_data->>'name';

    -- Split name into first and last (Google provides "First Last" format)
    IF full_name IS NOT NULL THEN
        name_parts := string_to_array(full_name, ' ');
        first := name_parts[1];

        -- Last name is everything after first name
        IF array_length(name_parts, 1) > 1 THEN
            last := array_to_string(name_parts[2:array_length(name_parts, 1)], ' ');
        ELSE
            last := '';
        END IF;
    ELSE
        -- Fallback if name not provided
        first := 'User';
        last := '';
    END IF;

    -- Insert new user into public.users table
    INSERT INTO public.users (
        id,
        first_name,
        last_name,
        email,
        profile_photo_path,
        created_at,
        last_updated,
        last_active
    ) VALUES (
        NEW.id,
        first,
        last,
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url',
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Trigger to call handle_new_user when a new user signs up via auth
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
