
import { supabase } from '@/integrations/supabase/client';

// Initialize the database with tables and initial data
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('Starting database initialization...');

    // Check if tables already exist to avoid duplicating setup
    const requiredTables = ['profiles', 'shops', 'products', 'orders', 'business_profiles', 'shop_payment_methods'];
    
    let existingTables: string[] = [];
    
    try {
      for (const table of requiredTables) {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
          
        if (!error) {
          existingTables.push(table);
        }
      }
    } catch (error) {
      console.error('Error checking tables:', error);
    }
    
    console.log('Existing tables:', existingTables);

    // If all required tables exist, skip initialization
    if (existingTables.length === requiredTables.length) {
      console.log('All required tables exist, skipping initialization');
      return true;
    }

    // Create profiles table if it doesn't exist
    if (!existingTables.includes('profiles')) {
      const { error: profilesError } = await supabase.rpc('create_profiles_table');
      
      if (profilesError) {
        console.error('Error creating profiles table:', profilesError);
        // Try direct SQL since RPC might fail
        await executeSQL(`
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
            name TEXT,
            email TEXT UNIQUE,
            avatar_url TEXT,
            role TEXT CHECK (role IN ('shopper', 'business')),
            phone TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            zip TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          -- RLS policies
          ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
          
          -- Allow users to view their own profile
          CREATE POLICY "Users can view own profile" ON profiles
            FOR SELECT USING (auth.uid() = id);
            
          -- Allow users to update their own profile
          CREATE POLICY "Users can update own profile" ON profiles
            FOR UPDATE USING (auth.uid() = id);
        `);
      }
    }

    // Create business_profiles table if it doesn't exist
    if (!existingTables.includes('business_profiles')) {
      const { error: businessProfilesError } = await supabase.rpc('create_business_profiles_table');
      
      if (businessProfilesError) {
        console.error('Error creating business_profiles table:', businessProfilesError);
        // Try direct SQL
        await executeSQL(`
          CREATE TABLE IF NOT EXISTS business_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
            shop_name TEXT,
            shop_description TEXT,
            shop_logo TEXT,
            shop_category TEXT,
            shop_location TEXT,
            business_verified BOOLEAN DEFAULT FALSE,
            business_documents JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          -- RLS policies
          ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
          
          -- Allow users to view their own business profile
          CREATE POLICY "Users can view own business profile" ON business_profiles
            FOR SELECT USING (auth.uid() = id);
            
          -- Allow users to update their own business profile
          CREATE POLICY "Users can update own business profile" ON business_profiles
            FOR UPDATE USING (auth.uid() = id);
        `);
      }
    }

    // Create shops table if it doesn't exist
    if (!existingTables.includes('shops')) {
      const { error: shopsError } = await supabase.rpc('create_shops_table');
      
      if (shopsError) {
        console.error('Error creating shops table:', shopsError);
        // Try direct SQL
        await executeSQL(`
          CREATE TABLE IF NOT EXISTS shops (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            logo TEXT,
            cover_image TEXT,
            owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            location TEXT,
            latitude DECIMAL,
            longitude DECIMAL,
            category TEXT,
            verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          -- RLS policies
          ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
          
          -- Everyone can view shops
          CREATE POLICY "Anyone can view shops" ON shops
            FOR SELECT USING (TRUE);
            
          -- Only owners can update their own shops
          CREATE POLICY "Owners can update their own shops" ON shops
            FOR UPDATE USING (auth.uid() = owner_id);
            
          -- Only owners can delete their own shops
          CREATE POLICY "Owners can delete their own shops" ON shops
            FOR DELETE USING (auth.uid() = owner_id);
            
          -- Only authenticated users can create shops
          CREATE POLICY "Authenticated users can create shops" ON shops
            FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
        `);
      }
    }

    // Create products table if it doesn't exist
    if (!existingTables.includes('products')) {
      const { error: productsError } = await supabase.rpc('create_products_table');
      
      if (productsError) {
        console.error('Error creating products table:', productsError);
        // Try direct SQL
        await executeSQL(`
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            long_description TEXT,
            price DECIMAL NOT NULL,
            discount_price DECIMAL,
            category TEXT,
            shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
            images TEXT[],
            details JSONB,
            is_published BOOLEAN DEFAULT FALSE,
            is_halal_certified BOOLEAN DEFAULT TRUE,
            stock_quantity INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          -- RLS policies
          ALTER TABLE products ENABLE ROW LEVEL SECURITY;
          
          -- Everyone can view products
          CREATE POLICY "Anyone can view products" ON products
            FOR SELECT USING (TRUE);
            
          -- Shop owners can update their own products
          CREATE POLICY "Shop owners can update their own products" ON products
            FOR UPDATE USING (
              EXISTS (
                SELECT 1 FROM shops
                WHERE shops.id = products.shop_id
                AND shops.owner_id = auth.uid()
              )
            );
            
          -- Shop owners can delete their own products
          CREATE POLICY "Shop owners can delete their own products" ON products
            FOR DELETE USING (
              EXISTS (
                SELECT 1 FROM shops
                WHERE shops.id = products.shop_id
                AND shops.owner_id = auth.uid()
              )
            );
            
          -- Shop owners can create products for their shops
          CREATE POLICY "Shop owners can create products" ON products
            FOR INSERT WITH CHECK (
              EXISTS (
                SELECT 1 FROM shops
                WHERE shops.id = products.shop_id
                AND shops.owner_id = auth.uid()
              )
            );
        `);
      }
    }

    // Create shop_payment_methods table if it doesn't exist
    if (!existingTables.includes('shop_payment_methods')) {
      const { error: paymentMethodsError } = await supabase.rpc('create_shop_payment_methods_table');
      
      if (paymentMethodsError) {
        console.error('Error creating shop_payment_methods table:', paymentMethodsError);
        // Try direct SQL
        await executeSQL(`
          CREATE TABLE IF NOT EXISTS shop_payment_methods (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            method_type TEXT NOT NULL,
            account_name TEXT,
            account_number TEXT,
            bank_name TEXT,
            paypal_email TEXT,
            stripe_account_id TEXT,
            applepay_merchant_id TEXT,
            is_default BOOLEAN DEFAULT FALSE,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          -- RLS policies
          ALTER TABLE shop_payment_methods ENABLE ROW LEVEL SECURITY;
          
          -- Shop owners can view their payment methods
          CREATE POLICY "Shop owners can view their payment methods" ON shop_payment_methods
            FOR SELECT USING (user_id = auth.uid());
            
          -- Shop owners can update their payment methods
          CREATE POLICY "Shop owners can update their payment methods" ON shop_payment_methods
            FOR UPDATE USING (user_id = auth.uid());
            
          -- Shop owners can delete their payment methods
          CREATE POLICY "Shop owners can delete their payment methods" ON shop_payment_methods
            FOR DELETE USING (user_id = auth.uid());
            
          -- Shop owners can create payment methods
          CREATE POLICY "Shop owners can create payment methods" ON shop_payment_methods
            FOR INSERT WITH CHECK (user_id = auth.uid());
        `);
      }
    }

    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Helper function to execute SQL directly
const executeSQL = async (sql: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Error executing SQL:', error);
    }
  } catch (error) {
    console.error('Error with RPC execution:', error);
  }
};
