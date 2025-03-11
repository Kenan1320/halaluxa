
-- This SQL script should be run on your Supabase instance
-- It creates the seller_accounts table and policies

CREATE TABLE IF NOT EXISTS public.seller_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
  account_type TEXT NOT NULL,
  account_name TEXT,
  account_number TEXT,
  bank_name TEXT,
  paypal_email TEXT,
  stripe_account_id TEXT,
  applepay_merchant_id TEXT,
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
  
-- Allow users to delete their own seller account
CREATE POLICY "Users can delete their own seller account"
  ON public.seller_accounts
  FOR DELETE
  USING (auth.uid() = user_id);
