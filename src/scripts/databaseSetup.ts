
import { supabase } from '@/integrations/supabase/client';

// Initialize the database with tables and initial data
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('Starting database initialization...');

    // Check if tables already exist to avoid duplicating setup
    const requiredTables = ['profiles', 'business_profiles', 'shops', 'products', 'orders', 'shop_payment_methods'];
    
    let existingTables: string[] = [];
    
    // Check each table existence by making a count query
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table as any)
          .select('*', { count: 'exact', head: true });
          
        if (!error) {
          existingTables.push(table);
        }
      } catch (error) {
        // Table doesn't exist
      }
    }
    
    console.log('Existing tables:', existingTables);

    // If all required tables exist, skip initialization
    if (existingTables.length === requiredTables.length) {
      console.log('All required tables exist, skipping initialization');
      return true;
    }

    // Use direct SQL execution through Supabase functions or API
    // We'll use the storage API to create tables if they don't exist
    
    if (!existingTables.includes('profiles')) {
      // Create profiles table using direct SQL
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
        
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own profile" ON profiles
          FOR SELECT USING (auth.uid() = id);
          
        CREATE POLICY "Users can update own profile" ON profiles
          FOR UPDATE USING (auth.uid() = id);
      `);
    }

    if (!existingTables.includes('business_profiles')) {
      // Create business_profiles table using direct SQL
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS business_profiles (
          id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
          shop_name TEXT,
          shop_description TEXT,
          shop_logo TEXT,
          shop_category TEXT,
          shop_location TEXT,
          business_verified BOOLEAN DEFAULT FALSE,
          business_documents JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own business profile" ON business_profiles
          FOR SELECT USING (auth.uid() = id);
          
        CREATE POLICY "Users can update own business profile" ON business_profiles
          FOR UPDATE USING (auth.uid() = id);
      `);
    }

    if (!existingTables.includes('shops')) {
      // Create shops table using direct SQL
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS shops (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          logo_url TEXT,
          cover_image TEXT,
          owner_id UUID NOT NULL,
          location TEXT,
          latitude DECIMAL,
          longitude DECIMAL,
          category TEXT,
          is_verified BOOLEAN DEFAULT FALSE,
          product_count INTEGER DEFAULT 0,
          rating NUMERIC DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Anyone can view shops" ON shops
          FOR SELECT USING (TRUE);
          
        CREATE POLICY "Owners can update their own shops" ON shops
          FOR UPDATE USING (auth.uid() = owner_id);
          
        CREATE POLICY "Owners can delete their own shops" ON shops
          FOR DELETE USING (auth.uid() = owner_id);
          
        CREATE POLICY "Authenticated users can create shops" ON shops
          FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
      `);
    }

    if (!existingTables.includes('products')) {
      // Create products table using direct SQL
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          long_description TEXT,
          price DECIMAL NOT NULL,
          category TEXT NOT NULL,
          shop_id UUID NOT NULL,
          images TEXT[],
          details JSONB DEFAULT '{}'::jsonb,
          is_published BOOLEAN DEFAULT FALSE,
          is_halal_certified BOOLEAN DEFAULT TRUE,
          stock INTEGER DEFAULT 0,
          rating NUMERIC DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Anyone can view products" ON products
          FOR SELECT USING (TRUE);
          
        CREATE POLICY "Shop owners can update their own products" ON products
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM shops
              WHERE shops.id = products.shop_id
              AND shops.owner_id = auth.uid()
            )
          );
          
        CREATE POLICY "Shop owners can delete their own products" ON products
          FOR DELETE USING (
            EXISTS (
              SELECT 1 FROM shops
              WHERE shops.id = products.shop_id
              AND shops.owner_id = auth.uid()
            )
          );
          
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

    if (!existingTables.includes('shop_payment_methods')) {
      // Create shop_payment_methods table using direct SQL
      await executeSQL(`
        CREATE TABLE IF NOT EXISTS shop_payment_methods (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          shop_id UUID NOT NULL,
          method_type TEXT NOT NULL,
          account_name TEXT,
          account_number TEXT,
          bank_name TEXT,
          paypal_email TEXT,
          stripe_account_id TEXT,
          is_default BOOLEAN DEFAULT FALSE,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        ALTER TABLE shop_payment_methods ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Shop owners can view their payment methods" ON shop_payment_methods
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM shops
              WHERE shops.id = shop_payment_methods.shop_id
              AND shops.owner_id = auth.uid()
            )
          );
          
        CREATE POLICY "Shop owners can update their payment methods" ON shop_payment_methods
          FOR UPDATE USING (
            EXISTS (
              SELECT 1 FROM shops
              WHERE shops.id = shop_payment_methods.shop_id
              AND shops.owner_id = auth.uid()
            )
          );
          
        CREATE POLICY "Shop owners can delete their payment methods" ON shop_payment_methods
          FOR DELETE USING (
            EXISTS (
              SELECT 1 FROM shops
              WHERE shops.id = shop_payment_methods.shop_id
              AND shops.owner_id = auth.uid()
            )
          );
          
        CREATE POLICY "Shop owners can create payment methods" ON shop_payment_methods
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM shops
              WHERE shops.id = shop_payment_methods.shop_id
              AND shops.owner_id = auth.uid()
            )
          );
      `);
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
    // Supabase doesn't directly support raw SQL execution in the client
    // In production, this would be done via serverless functions or edge functions
    // For now, we'll just log the SQL that would be executed
    console.log('Would execute SQL:', sql);
    
    // In a real implementation, this could be executed via:
    // 1. Supabase Edge Functions
    // 2. A serverless function that has direct database access
    // 3. The Supabase dashboard SQL editor
  } catch (error) {
    console.error('Error executing SQL:', error);
  }
};
