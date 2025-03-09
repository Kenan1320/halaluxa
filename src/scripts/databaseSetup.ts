
import { supabase } from '@/integrations/supabase/client';

/**
 * Initializes the database schema with required tables if they don't exist
 */
export async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Check if we have the required tables
    const { data: existingTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
      return false;
    }
    
    const tableNames = existingTables?.map(t => t.table_name) || [];
    console.log('Existing tables:', tableNames);
    
    // Check if the profiles table exists
    if (!tableNames.includes('profiles')) {
      console.log('Creating profiles table...');
      await createProfilesTable();
    }
    
    // Check if the business_profiles table exists
    if (!tableNames.includes('business_profiles')) {
      console.log('Creating business_profiles table...');
      await createBusinessProfilesTable();
    }
    
    // Check if the shops table exists
    if (!tableNames.includes('shops')) {
      console.log('Creating shops table...');
      await createShopsTable();
    }
    
    // Check if the shop_payment_methods table exists
    if (!tableNames.includes('shop_payment_methods')) {
      console.log('Creating shop_payment_methods table...');
      await createShopPaymentMethodsTable();
    }
    
    console.log('Database initialization complete');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Creates the profiles table if it doesn't exist
 */
async function createProfilesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT,
      email TEXT,
      role TEXT CHECK (role IN ('shopper', 'business')),
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
    
    -- Create a trigger to update timestamps
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
    CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;
  
  const { error } = await supabase.rpc('exec_sql', { query });
  if (error) {
    console.error('Error creating profiles table:', error);
    throw error;
  }
}

/**
 * Creates the business_profiles table if it doesn't exist
 */
async function createBusinessProfilesTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS public.business_profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      shop_name TEXT,
      shop_description TEXT,
      shop_category TEXT,
      shop_location TEXT,
      shop_logo TEXT,
      shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
      business_verified BOOLEAN DEFAULT false,
      business_documents JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- Enable RLS
    ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    DROP POLICY IF EXISTS "Users can view their own business profile" ON public.business_profiles;
    CREATE POLICY "Users can view their own business profile"
    ON public.business_profiles
    FOR SELECT
    USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Users can update their own business profile" ON public.business_profiles;
    CREATE POLICY "Users can update their own business profile"
    ON public.business_profiles
    FOR UPDATE
    USING (auth.uid() = id);
    
    -- Create a trigger to update timestamps
    DROP TRIGGER IF EXISTS update_business_profiles_updated_at ON public.business_profiles;
    CREATE TRIGGER update_business_profiles_updated_at
    BEFORE UPDATE ON public.business_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;
  
  const { error } = await supabase.rpc('exec_sql', { query });
  if (error) {
    console.error('Error creating business_profiles table:', error);
    throw error;
  }
}

/**
 * Creates the shops table if it doesn't exist
 */
async function createShopsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS public.shops (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      location TEXT,
      latitude FLOAT,
      longitude FLOAT,
      rating FLOAT DEFAULT 0,
      product_count INTEGER DEFAULT 0,
      is_verified BOOLEAN DEFAULT false,
      category TEXT,
      logo_url TEXT,
      cover_image TEXT,
      owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
    
    -- Enable RLS
    ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    DROP POLICY IF EXISTS "Anyone can view shops" ON public.shops;
    CREATE POLICY "Anyone can view shops"
    ON public.shops
    FOR SELECT
    USING (true);
    
    DROP POLICY IF EXISTS "Owners can update their shops" ON public.shops;
    CREATE POLICY "Owners can update their shops"
    ON public.shops
    FOR UPDATE
    USING (auth.uid() = owner_id);
    
    DROP POLICY IF EXISTS "Owners can delete their shops" ON public.shops;
    CREATE POLICY "Owners can delete their shops"
    ON public.shops
    FOR DELETE
    USING (auth.uid() = owner_id);
    
    DROP POLICY IF EXISTS "Owners can insert shops" ON public.shops;
    CREATE POLICY "Owners can insert shops"
    ON public.shops
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);
    
    -- Create a trigger to update timestamps
    DROP TRIGGER IF EXISTS update_shops_updated_at ON public.shops;
    CREATE TRIGGER update_shops_updated_at
    BEFORE UPDATE ON public.shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;
  
  const { error } = await supabase.rpc('exec_sql', { query });
  if (error) {
    console.error('Error creating shops table:', error);
    throw error;
  }
}

/**
 * Creates the shop_payment_methods table if it doesn't exist
 */
async function createShopPaymentMethodsTable() {
  const query = `
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
    DROP POLICY IF EXISTS "Users can read their own payment methods" ON public.shop_payment_methods;
    CREATE POLICY "Users can read their own payment methods"
      ON public.shop_payment_methods
      FOR SELECT
      USING (auth.uid() = user_id);
      
    -- Allow users to insert their own payment methods
    DROP POLICY IF EXISTS "Users can insert their own payment methods" ON public.shop_payment_methods;
    CREATE POLICY "Users can insert their own payment methods"
      ON public.shop_payment_methods
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
      
    -- Allow users to update their own payment methods
    DROP POLICY IF EXISTS "Users can update their own payment methods" ON public.shop_payment_methods;
    CREATE POLICY "Users can update their own payment methods"
      ON public.shop_payment_methods
      FOR UPDATE
      USING (auth.uid() = user_id);
      
    -- Allow users to delete their own payment methods
    DROP POLICY IF EXISTS "Users can delete their own payment methods" ON public.shop_payment_methods;
    CREATE POLICY "Users can delete their own payment methods"
      ON public.shop_payment_methods
      FOR DELETE
      USING (auth.uid() = user_id);
    
    -- Create a trigger to update timestamps
    DROP TRIGGER IF EXISTS update_shop_payment_methods_timestamp ON public.shop_payment_methods;
    CREATE TRIGGER update_shop_payment_methods_timestamp
    BEFORE UPDATE ON public.shop_payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `;
  
  const { error } = await supabase.rpc('exec_sql', { query });
  if (error) {
    console.error('Error creating shop_payment_methods table:', error);
    throw error;
  }
}

// Create a new user if registration is successful but profile is missing
export async function createUserProfile(userId: string, email: string, role: 'shopper' | 'business') {
  try {
    console.log('Creating user profile for:', userId);
    
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (existingProfile) {
      console.log('Profile already exists');
      return true;
    }
    
    // Create new profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        role
      });
      
    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }
    
    // If business user, also create business profile
    if (role === 'business') {
      const { error: businessError } = await supabase
        .from('business_profiles')
        .insert({
          id: userId
        });
        
      if (businessError) {
        console.error('Error creating business profile:', businessError);
        throw businessError;
      }
    }
    
    console.log('User profile created successfully');
    return true;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return false;
  }
}

// Register a new user with automatic profile creation
export async function registerUser(email: string, password: string, name: string, role: 'shopper' | 'business') {
  try {
    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });
    
    if (error) throw error;
    
    // If user is created, ensure profile exists
    if (data?.user) {
      await createUserProfile(data.user.id, email, role);
    }
    
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}
