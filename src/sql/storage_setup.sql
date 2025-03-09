
-- Create storage buckets for shop logos and product images if they don't exist yet
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('shop-logos', 'shop-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Set up public access policies for shop-logos
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'shop-logos');

-- Allow authenticated users to insert into shop-logos
CREATE POLICY "Authenticated Insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'shop-logos');

-- Allow users to update and delete their own objects in shop-logos
CREATE POLICY "Owner Update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'shop-logos' AND auth.uid() = owner);

CREATE POLICY "Owner Delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'shop-logos' AND auth.uid() = owner);

-- Set up public access policies for product-images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated users to insert into product-images
CREATE POLICY "Authenticated Insert" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow users to update and delete their own objects in product-images
CREATE POLICY "Owner Update" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND auth.uid() = owner);

CREATE POLICY "Owner Delete" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND auth.uid() = owner);
