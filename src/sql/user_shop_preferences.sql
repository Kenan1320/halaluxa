
-- Create the user_shop_preferences table for storing user shop selections
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

-- Create an RLS policy to allow users to select their own preferences
CREATE POLICY select_own_shop_prefs ON user_shop_preferences 
  FOR SELECT USING (auth.uid() = user_id);

-- Create an RLS policy to allow users to insert their own preferences
CREATE POLICY insert_own_shop_prefs ON user_shop_preferences 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create an RLS policy to allow users to update their own preferences
CREATE POLICY update_own_shop_prefs ON user_shop_preferences 
  FOR UPDATE USING (auth.uid() = user_id);

-- Create an RLS policy to allow users to delete their own preferences
CREATE POLICY delete_own_shop_prefs ON user_shop_preferences 
  FOR DELETE USING (auth.uid() = user_id);

-- Add main_shop_id column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS main_shop_id UUID REFERENCES shops(id) ON DELETE SET NULL;
