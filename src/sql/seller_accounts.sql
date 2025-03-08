
-- This SQL function should be run on your Supabase instance to create the seller_accounts table if it doesn't exist
-- Execute this via the SQL Editor in Supabase

CREATE OR REPLACE FUNCTION create_seller_accounts_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Check if the seller_accounts table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'seller_accounts'
  ) THEN
    CREATE TABLE public.seller_accounts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Add RLS policies
    ALTER TABLE public.seller_accounts ENABLE ROW LEVEL SECURITY;
    
    -- Allow users to read their own seller account
    CREATE POLICY "Users can read their own seller account"
      ON public.seller_accounts
      FOR SELECT
      USING (auth.uid() = user_id);
      
    -- Allow users to insert their own seller account
    CREATE POLICY "Users can insert their own seller account"
      ON public.seller_accounts
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    -- Allow users to update their own seller account
    CREATE POLICY "Users can update their own seller account"
      ON public.seller_accounts
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
  
  -- Check if shopper_payment_methods table exists, if not create it
  IF NOT EXISTS (
    SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'shopper_payment_methods'
  ) THEN
    CREATE TABLE public.shopper_payment_methods (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      payment_type TEXT NOT NULL,
      card_last_four TEXT,
      card_brand TEXT,
      billing_address JSONB,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      metadata JSONB
    );
    
    -- Add RLS policies
    ALTER TABLE public.shopper_payment_methods ENABLE ROW LEVEL SECURITY;
    
    -- Allow users to read their own payment methods
    CREATE POLICY "Users can read their own payment methods"
      ON public.shopper_payment_methods
      FOR SELECT
      USING (auth.uid() = user_id);
      
    -- Allow users to insert their own payment methods
    CREATE POLICY "Users can insert their own payment methods"
      ON public.shopper_payment_methods
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    -- Allow users to update their own payment methods
    CREATE POLICY "Users can update their own payment methods"
      ON public.shopper_payment_methods
      FOR UPDATE
      USING (auth.uid() = user_id);
      
    -- Allow users to delete their own payment methods
    CREATE POLICY "Users can delete their own payment methods"
      ON public.shopper_payment_methods
      FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Call the function to ensure the tables exist
SELECT create_seller_accounts_if_not_exists();
