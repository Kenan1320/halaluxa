
-- Create a profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('shopper', 'business')),
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create a business profiles table
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  shop_name TEXT,
  shop_description TEXT,
  shop_logo TEXT,
  shop_category TEXT,
  shop_location TEXT,
  business_verified BOOLEAN DEFAULT false,
  business_documents JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create a user shop preferences table
CREATE TABLE IF NOT EXISTS public.user_shop_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  is_following BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  is_main_shop BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, shop_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_shop_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create policies for business_profiles
CREATE POLICY "Business owners can view their own business profile"
ON public.business_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Business owners can update their own business profile"
ON public.business_profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create policies for user_shop_preferences
CREATE POLICY "Users can view their own shop preferences"
ON public.user_shop_preferences
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own shop preferences"
ON public.user_shop_preferences
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shop preferences"
ON public.user_shop_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shop preferences"
ON public.user_shop_preferences
FOR DELETE
USING (auth.uid() = user_id);

-- Create a trigger to create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'shopper'));
  
  -- If the user is a business owner, create a business profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'shopper') = 'business' THEN
    INSERT INTO public.business_profiles (id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
