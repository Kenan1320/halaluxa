
-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'support', 'moderator', 'viewer')) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Add RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin records
CREATE POLICY "Allow admins to read admin records"
  ON public.admins
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
  );

-- Only super admins can manage admin records
CREATE POLICY "Allow super admins to manage admin records"
  ON public.admins
  USING (
    auth.uid() IN (SELECT user_id FROM public.admins WHERE role = 'admin')
  );

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.admins(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Allow admins to read audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
  );

-- Create admin_permissions table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  resource TEXT NOT NULL,
  can_create BOOLEAN DEFAULT false,
  can_read BOOLEAN DEFAULT true,
  can_update BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, resource)
);

-- Add RLS
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Only admins can read permissions
CREATE POLICY "Allow admins to read permissions"
  ON public.admin_permissions
  FOR SELECT
  USING (
    auth.uid() IN (SELECT user_id FROM public.admins)
  );

-- Only super admins can manage permissions
CREATE POLICY "Allow super admins to manage permissions"
  ON public.admin_permissions
  USING (
    auth.uid() IN (SELECT user_id FROM public.admins WHERE role = 'admin')
  );

-- Insert default permissions for admin role
INSERT INTO public.admin_permissions (role, resource, can_create, can_read, can_update, can_delete)
VALUES
  ('admin', 'shops', true, true, true, true),
  ('admin', 'products', true, true, true, true),
  ('admin', 'users', true, true, true, true),
  ('admin', 'orders', true, true, true, true),
  ('admin', 'settings', true, true, true, true),
  ('support', 'shops', false, true, true, false),
  ('support', 'products', false, true, true, false),
  ('support', 'users', false, true, true, false),
  ('support', 'orders', false, true, true, true),
  ('support', 'settings', false, true, false, false),
  ('moderator', 'shops', false, true, true, false),
  ('moderator', 'products', true, true, true, true),
  ('moderator', 'users', false, true, false, false),
  ('moderator', 'orders', false, true, true, false),
  ('moderator', 'settings', false, true, false, false),
  ('viewer', 'shops', false, true, false, false),
  ('viewer', 'products', false, true, false, false),
  ('viewer', 'users', false, true, false, false),
  ('viewer', 'orders', false, true, false, false),
  ('viewer', 'settings', false, true, false, false)
ON CONFLICT (role, resource) DO NOTHING;

-- Add status column to shops table if it doesn't exist
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')) DEFAULT 'pending';
