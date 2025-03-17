
-- Create admin roles enum
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role admin_role NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login TIMESTAMPTZ,
    UNIQUE (user_id)
);

-- Create admin permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL,
    resource TEXT NOT NULL,
    can_create BOOLEAN NOT NULL DEFAULT false,
    can_read BOOLEAN NOT NULL DEFAULT true,
    can_update BOOLEAN NOT NULL DEFAULT false,
    can_delete BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.admins
        WHERE admins.user_id = is_admin.user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to grant a user admin privileges
CREATE OR REPLACE FUNCTION create_admin_user(
    user_id UUID,
    admin_role admin_role DEFAULT 'admin'
)
RETURNS UUID AS $$
DECLARE
    admin_id UUID;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
        RAISE EXCEPTION 'User does not exist';
    END IF;
    
    -- Check if user is already an admin
    IF EXISTS (SELECT 1 FROM public.admins WHERE admins.user_id = create_admin_user.user_id) THEN
        RETURN (SELECT id FROM public.admins WHERE admins.user_id = create_admin_user.user_id);
    END IF;
    
    -- Create admin user
    INSERT INTO public.admins (user_id, role)
    VALUES (user_id, admin_role)
    RETURNING id INTO admin_id;
    
    -- Grant default permissions based on role
    IF admin_role = 'super_admin' THEN
        -- Super admin gets all permissions
        INSERT INTO public.admin_permissions (admin_id, role, resource, can_create, can_read, can_update, can_delete)
        VALUES 
            (admin_id, 'super_admin', 'shops', true, true, true, true),
            (admin_id, 'super_admin', 'products', true, true, true, true),
            (admin_id, 'super_admin', 'users', true, true, true, true),
            (admin_id, 'super_admin', 'orders', true, true, true, true),
            (admin_id, 'super_admin', 'system', true, true, true, true);
    ELSIF admin_role = 'admin' THEN
        -- Regular admin gets most permissions but not system
        INSERT INTO public.admin_permissions (admin_id, role, resource, can_create, can_read, can_update, can_delete)
        VALUES 
            (admin_id, 'admin', 'shops', true, true, true, false),
            (admin_id, 'admin', 'products', true, true, true, false),
            (admin_id, 'admin', 'users', false, true, true, false),
            (admin_id, 'admin', 'orders', false, true, true, false),
            (admin_id, 'admin', 'system', false, true, false, false);
    ELSIF admin_role = 'moderator' THEN
        -- Moderator gets limited permissions
        INSERT INTO public.admin_permissions (admin_id, role, resource, can_create, can_read, can_update, can_delete)
        VALUES 
            (admin_id, 'moderator', 'shops', false, true, true, false),
            (admin_id, 'moderator', 'products', false, true, true, false),
            (admin_id, 'moderator', 'users', false, true, false, false),
            (admin_id, 'moderator', 'orders', false, true, false, false),
            (admin_id, 'moderator', 'system', false, false, false, false);
    END IF;
    
    RETURN admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up Row Level Security policies
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Admin RLS policies
CREATE POLICY "Allow admins to view all admins"
    ON public.admins
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage other admins"
    ON public.admins
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.admins
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- Admin permissions RLS policies
CREATE POLICY "Allow admins to view permissions"
    ON public.admin_permissions
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

CREATE POLICY "Super admins can manage permissions"
    ON public.admin_permissions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.admins
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- Create a function to check if running in dev mode for testing
-- This is not secure and should only be used in development
CREATE OR REPLACE FUNCTION is_development()
RETURNS BOOLEAN AS $$
BEGIN
    -- Always return false in production
    -- In development, you would modify this to return true
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to auto-grant admin access to any authenticated user in dev mode
CREATE OR REPLACE FUNCTION dev_mode_admin_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Only run in dev mode
    IF is_development() THEN
        -- Auto-create admin entry for any new user
        PERFORM create_admin_user(NEW.id, 'super_admin');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a trigger to automatically create admin users in dev mode
DROP TRIGGER IF EXISTS auto_admin_dev_mode ON auth.users;
CREATE TRIGGER auto_admin_dev_mode
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION dev_mode_admin_access();

-- Create a default super admin in development mode
-- This is just for development, don't use in production
DO $$
BEGIN
    IF is_development() THEN
        PERFORM create_admin_user(
            '00000000-0000-0000-0000-000000000000', -- Replace with a real user ID
            'super_admin'
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Failed to create default super admin: %', SQLERRM;
END $$;
