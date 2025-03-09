
// Replace the getTableNames function that used to check for seller_accounts
import { supabase } from '@/integrations/supabase/client';

// Main setup function
export async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Check for necessary tables
    const tablesExist = await checkTables();
    if (!tablesExist) {
      console.error('Database tables setup incomplete');
      return false;
    }
    
    console.log('Database setup complete');
    return true;
  } catch (error) {
    console.error('Error in database setup:', error);
    return false;
  }
}

// Check if required tables exist
async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Define the tables we need to check for
    const requiredTables = [
      'profiles',
      'business_profiles',
      'shops',
      'products',
      'orders',
      'shop_payment_methods'
    ];
    
    // Get list of existing tables
    const { data: existingTables, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
    
    if (error) {
      console.error('Error checking tables:', error);
      return false;
    }
    
    // Check if all required tables exist
    const tableNames = existingTables.map(t => t.tablename);
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.error('Missing required tables:', missingTables);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
}

// Run the setup
setupDatabase().then(success => {
  console.log('Database setup result:', success ? 'Success' : 'Failed');
});
