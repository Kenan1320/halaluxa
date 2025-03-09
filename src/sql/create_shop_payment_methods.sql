
-- Create shop_payment_methods table to handle payment methods for businesses
CREATE TABLE IF NOT EXISTS public.shop_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('bank', 'paypal', 'stripe', 'applepay', 'other')),
  account_name TEXT,
  account_number TEXT,
  bank_name TEXT,
  paypal_email TEXT,
  stripe_account_id TEXT,
  applepay_merchant_id TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.shop_payment_methods ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own payment methods
CREATE POLICY "Users can read their own payment methods"
  ON public.shop_payment_methods
  FOR SELECT
  USING (auth.uid() = user_id);
  
-- Allow users to insert their own payment methods
CREATE POLICY "Users can insert their own payment methods"
  ON public.shop_payment_methods
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
-- Allow users to update their own payment methods
CREATE POLICY "Users can update their own payment methods"
  ON public.shop_payment_methods
  FOR UPDATE
  USING (auth.uid() = user_id);
  
-- Allow users to delete their own payment methods
CREATE POLICY "Users can delete their own payment methods"
  ON public.shop_payment_methods
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_shop_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for timestamp updates
CREATE TRIGGER update_shop_payment_methods_timestamp
BEFORE UPDATE ON public.shop_payment_methods
FOR EACH ROW EXECUTE FUNCTION update_shop_payment_methods_updated_at();
