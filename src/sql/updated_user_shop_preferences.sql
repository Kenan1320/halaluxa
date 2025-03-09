
-- Create the user_shop_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_shop_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  is_following BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_main_shop BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, shop_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_shop_prefs_user_id ON user_shop_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_shop_prefs_shop_id ON user_shop_preferences(shop_id);
CREATE INDEX IF NOT EXISTS idx_user_shop_prefs_main ON user_shop_preferences(user_id, is_main_shop);

-- Add main_shop_id column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS main_shop_id UUID REFERENCES shops(id) ON DELETE SET NULL;

-- Enable RLS on the user_shop_preferences table
ALTER TABLE user_shop_preferences ENABLE ROW LEVEL SECURITY;

-- Create RPC function to get user shop preferences with shop details
CREATE OR REPLACE FUNCTION get_user_shop_preferences(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  shop_id UUID,
  is_following BOOLEAN,
  is_favorite BOOLEAN,
  is_main_shop BOOLEAN,
  shop JSONB
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    usp.id,
    usp.user_id,
    usp.shop_id,
    usp.is_following,
    usp.is_favorite,
    usp.is_main_shop,
    jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'description', s.description,
      'category', s.category,
      'logo_url', s.logo_url
    ) AS shop
  FROM 
    user_shop_preferences usp
  JOIN 
    shops s ON usp.shop_id = s.id
  WHERE 
    usp.user_id = user_id_param;
END;
$$;

-- Create RLS policies for user_shop_preferences
CREATE POLICY "Users can view their own preferences" 
  ON user_shop_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON user_shop_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON user_shop_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" 
  ON user_shop_preferences 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Fix storage permissions for shop-logos and product-images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('shop-logos', 'shop-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Public shop-logos read access" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can upload shop-logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their shop-logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their shop-logos" ON storage.objects;
DROP POLICY IF EXISTS "Public product-images read access" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their product-images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their product-images" ON storage.objects;

-- Create shop-logos policies
CREATE POLICY "Public shop-logos read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop-logos');

CREATE POLICY "Auth users can upload shop-logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'shop-logos');

CREATE POLICY "Users can update their shop-logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'shop-logos' AND owner = auth.uid());

CREATE POLICY "Users can delete their shop-logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'shop-logos' AND owner = auth.uid());

-- Create product-images policies
CREATE POLICY "Public product-images read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Auth users can upload product-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Users can update their product-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND owner = auth.uid());

CREATE POLICY "Users can delete their product-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND owner = auth.uid());
