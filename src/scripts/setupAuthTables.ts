
import { supabase } from '@/integrations/supabase/client';

/**
 * This script sets up all the necessary database tables and policies for authentication
 * Run this script once to initialize the database structure
 */
export const setupAuthTables = async () => {
  try {
    // Create profiles table
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS "public"."profiles" (
          "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          "email" TEXT NOT NULL,
          "name" TEXT,
          "role" TEXT NOT NULL CHECK (role IN ('shopper', 'business')),
          "avatar_url" TEXT,
          "phone" TEXT,
          "address" TEXT,
          "city" TEXT,
          "state" TEXT,
          "zip" TEXT,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
      `
    });

    if (profilesError) {
      throw profilesError;
    }

    // Create business_profiles table
    const { error: businessProfilesError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS "public"."business_profiles" (
          "id" UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
          "shop_name" TEXT,
          "shop_description" TEXT,
          "shop_logo" TEXT,
          "shop_category" TEXT,
          "shop_location" TEXT,
          "business_verified" BOOLEAN DEFAULT false,
          "business_documents" JSONB DEFAULT '{}',
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
      `
    });

    if (businessProfilesError) {
      throw businessProfilesError;
    }

    // Create user_shop_preferences table
    const { error: preferencesError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS "public"."user_shop_preferences" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "user_id" UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
          "shop_id" UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
          "is_following" BOOLEAN DEFAULT false,
          "is_favorite" BOOLEAN DEFAULT false,
          "is_main_shop" BOOLEAN DEFAULT false,
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          UNIQUE(user_id, shop_id)
        );
      `
    });

    if (preferencesError) {
      throw preferencesError;
    }

    // Enable RLS on all tables
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE IF EXISTS "public"."profiles" ENABLE ROW LEVEL SECURITY;
        ALTER TABLE IF EXISTS "public"."business_profiles" ENABLE ROW LEVEL SECURITY;
        ALTER TABLE IF EXISTS "public"."user_shop_preferences" ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError) {
      throw rlsError;
    }

    // Create RLS policies for profiles
    const { error: profilePoliciesError } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Drop existing policies to avoid duplicates
        DROP POLICY IF EXISTS "Users can view their own profile" ON "public"."profiles";
        DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."profiles";
        
        -- Create new policies
        CREATE POLICY "Users can view their own profile" 
        ON "public"."profiles" FOR SELECT 
        USING (auth.uid() = id);
        
        CREATE POLICY "Users can update their own profile" 
        ON "public"."profiles" FOR UPDATE 
        USING (auth.uid() = id);
      `
    });

    if (profilePoliciesError) {
      throw profilePoliciesError;
    }

    // Create RLS policies for business_profiles
    const { error: businessPoliciesError } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Drop existing policies to avoid duplicates
        DROP POLICY IF EXISTS "Business owners can view their own business profile" ON "public"."business_profiles";
        DROP POLICY IF EXISTS "Business owners can update their own business profile" ON "public"."business_profiles";
        
        -- Create new policies
        CREATE POLICY "Business owners can view their own business profile" 
        ON "public"."business_profiles" FOR SELECT 
        USING (auth.uid() = id);
        
        CREATE POLICY "Business owners can update their own business profile" 
        ON "public"."business_profiles" FOR UPDATE 
        USING (auth.uid() = id);
      `
    });

    if (businessPoliciesError) {
      throw businessPoliciesError;
    }

    // Create RLS policies for user_shop_preferences
    const { error: preferencesPoliciesError } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Drop existing policies to avoid duplicates
        DROP POLICY IF EXISTS "Users can view their own shop preferences" ON "public"."user_shop_preferences";
        DROP POLICY IF EXISTS "Users can update their own shop preferences" ON "public"."user_shop_preferences";
        DROP POLICY IF EXISTS "Users can insert their own shop preferences" ON "public"."user_shop_preferences";
        DROP POLICY IF EXISTS "Users can delete their own shop preferences" ON "public"."user_shop_preferences";
        
        -- Create new policies
        CREATE POLICY "Users can view their own shop preferences" 
        ON "public"."user_shop_preferences" FOR SELECT 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own shop preferences" 
        ON "public"."user_shop_preferences" FOR UPDATE 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own shop preferences" 
        ON "public"."user_shop_preferences" FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own shop preferences" 
        ON "public"."user_shop_preferences" FOR DELETE 
        USING (auth.uid() = user_id);
      `
    });

    if (preferencesPoliciesError) {
      throw preferencesPoliciesError;
    }

    // Create trigger function and trigger for new user registration
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql_query: `
        -- Drop existing function and trigger to avoid duplicates
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        DROP FUNCTION IF EXISTS public.handle_new_user();
        
        -- Create new function and trigger
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
      `
    });

    if (triggerError) {
      throw triggerError;
    }

    console.log('Database tables and policies set up successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up database tables:', error);
    return false;
  }
};
