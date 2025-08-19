-- Location: supabase/migrations/20250815154305_create_demo_users_for_authentication.sql
-- Schema Analysis: FITS AI system has existing profiles table and auth infrastructure
-- Integration Type: Addition - Creating demo auth users to match login form credentials
-- Dependencies: profiles table, existing authentication system

-- Demo Authentication Users for Login System
-- Creates the demo users referenced in the authentication login form

DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    employee_uuid UUID := gen_random_uuid();
    support_uuid UUID := gen_random_uuid();
    security_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields matching login form credentials
    -- **ALWAYS include all fields for auth.users** All of them even the null. Without it the user will not be able to signin.
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@company.com', crypt('Admin123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (employee_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'employee@company.com', crypt('Employee123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Employee User", "role": "viewer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (support_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'support@company.com', crypt('Support123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Support User", "role": "sme"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (security_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'security@company.com', crypt('Security123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Security User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create corresponding profiles (will be auto-created by handle_new_user trigger if it exists)
    -- Manual insert to ensure profiles exist
    INSERT INTO public.profiles (id, user_id, display_name, role, department, language_preference) VALUES
        (gen_random_uuid(), admin_uuid, 'Admin User', 'admin', 'IT Administration', 'en'),
        (gen_random_uuid(), employee_uuid, 'Employee User', 'viewer', 'General', 'en'),
        (gen_random_uuid(), support_uuid, 'Support User', 'sme', 'IT Support', 'en'),
        (gen_random_uuid(), security_uuid, 'Security User', 'admin', 'IT Security', 'en')
    ON CONFLICT (user_id) DO NOTHING; -- In case trigger already created profiles

    -- Create user roles
    INSERT INTO public.user_roles (user_id, role) VALUES
        (admin_uuid, 'admin'::app_role),
        (employee_uuid, 'viewer'::app_role),
        (support_uuid, 'sme'::app_role),
        (security_uuid, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    RAISE NOTICE 'Demo users created successfully:';
    RAISE NOTICE 'Admin: admin@company.com / Admin123!';
    RAISE NOTICE 'Employee: employee@company.com / Employee123!';
    RAISE NOTICE 'Support: support@company.com / Support123!';
    RAISE NOTICE 'Security: security@company.com / Security123!';

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error in demo user creation: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'User already exists (skipping): %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error in demo user creation: %', SQLERRM;
END $$;

-- Optional: Function to clean up demo users (for testing)
CREATE OR REPLACE FUNCTION public.cleanup_demo_users()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    demo_user_ids UUID[];
BEGIN
    -- Get demo user IDs
    SELECT ARRAY_AGG(id) INTO demo_user_ids
    FROM auth.users
    WHERE email IN ('admin@company.com', 'employee@company.com', 'support@company.com', 'security@company.com');

    -- Delete in dependency order (children first)
    DELETE FROM public.user_roles WHERE user_id = ANY(demo_user_ids);
    DELETE FROM public.profiles WHERE user_id = ANY(demo_user_ids);
    DELETE FROM auth.users WHERE id = ANY(demo_user_ids);
    
    RAISE NOTICE 'Demo users cleaned up successfully';
    
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents demo user cleanup: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Demo user cleanup failed: %', SQLERRM;
END;
$$;