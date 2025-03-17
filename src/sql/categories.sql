
-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES public.categories(id),
  group TEXT CHECK (group IN ('featured', 'nearby', 'online', 'popular', 'transitional')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read categories
CREATE POLICY "Allow public read access to categories"
  ON public.categories
  FOR SELECT
  USING (true);

-- Allow authenticated admin users to manage categories
CREATE POLICY "Allow admin users to manage categories"
  ON public.categories
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));
