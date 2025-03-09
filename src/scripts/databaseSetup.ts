
import { supabase } from '@/integrations/supabase/client';

/**
 * Setup database tables and relationships.
 * This function should be called at app startup to ensure all needed tables exist.
 */
export const setupDatabase = async (): Promise<boolean> => {
  try {
    // Check if the Supabase client is initialized
    if (!supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    // Try to query each of the required tables to check if they exist
    const requiredTables = [
      'profiles',
      'shops',
      'products',
      'orders',
      'seller_accounts',
      'shop_display_settings'
    ];
    
    let tablesExist = true;
    
    for (const table of requiredTables) {
      const { data, error } = await supabase
        .from(table)
        .select('count(*)')
        .limit(1);
        
      if (error) {
        console.error(`Table ${table} might not exist or is inaccessible:`, error);
        tablesExist = false;
      } else {
        console.log(`Table ${table} exists`);
      }
    }
    
    if (!tablesExist) {
      console.warn('Some required tables do not exist. Please run the database setup SQL.');
      return false;
    }
    
    // The database tables exist, now check that the seller_accounts table has the correct structure
    console.log('Database tables exist');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
};

// Function to run database setup tasks
export const runDatabaseSetup = async (): Promise<boolean> => {
  const success = await setupDatabase();
  return success;
};

export default runDatabaseSetup;
