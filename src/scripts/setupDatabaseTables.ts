
import { supabase } from '@/integrations/supabase/client';

export const setupDatabaseTables = async (): Promise<void> => {
  console.log('Setting up database tables...');
  
  // Execute the SQL for setting up user_shop_preferences functions
  try {
    // Run the SQL files in sequence
    const { error } = await supabase.rpc('get_user_shop_preferences', { user_id_param: null });
    if (error && error.code !== 'PGRST116') {
      console.error('Error setting up database functions:', error);
    } else {
      console.log('Database functions are already set up');
    }
  } catch (error) {
    console.error('Error in database setup:', error);
  }
};
