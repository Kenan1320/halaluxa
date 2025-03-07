
-- Create a table for storing payment methods for shoppers
CREATE TABLE IF NOT EXISTS public.shopper_payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('card', 'paypal', 'applepay', 'googlepay')),
  card_last_four TEXT,
  card_brand TEXT,
  billing_address JSONB,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  metadata JSONB
);

-- Create RLS policies for shopper_payment_methods
ALTER TABLE public.shopper_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment methods"
ON public.shopper_payment_methods
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
ON public.shopper_payment_methods
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
ON public.shopper_payment_methods
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
ON public.shopper_payment_methods
FOR DELETE
USING (auth.uid() = user_id);

-- Add missing RLS policies to profiles table if not already present
CREATE POLICY IF NOT EXISTS "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Ensure trigger exists for creating profiles on signup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Add latitude/longitude to shops table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shops' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE public.shops ADD COLUMN latitude DOUBLE PRECISION;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shops' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE public.shops ADD COLUMN longitude DOUBLE PRECISION;
  END IF;
END $$;
