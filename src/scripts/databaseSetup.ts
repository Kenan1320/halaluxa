
import { supabase } from '@/integrations/supabase/client';

// This function checks if required tables exist and creates them if they don't
export async function setupDatabase() {
  try {
    console.log('Checking database setup...');
    
    // 1. Check if seller_accounts table exists
    const { error: sellerAccountsError } = await supabase
      .from('seller_accounts')
      .select('id')
      .limit(1);
    
    if (sellerAccountsError && sellerAccountsError.code === '42P01') { // Table doesn't exist
      console.log('Creating seller_accounts table...');
      
      // Create the seller_accounts table
      await supabase.rpc('create_seller_accounts_if_not_exists');
    }
    
    // 2. Check if the shopper_payment_methods table exists
    const { error: paymentMethodsError } = await supabase
      .from('shopper_payment_methods')
      .select('id')
      .limit(1);
    
    if (paymentMethodsError && paymentMethodsError.code === '42P01') { // Table doesn't exist
      console.log('Creating shopper_payment_methods table...');
      
      // If we need to create this table too, call the same RPC function
      await supabase.rpc('create_seller_accounts_if_not_exists');
    }
    
    console.log('Database setup complete!');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

// This function should be called when the app starts
export async function runDatabaseSetup() {
  return await setupDatabase();
}
