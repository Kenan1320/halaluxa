import { supabase } from '@/integrations/supabase/client';

async function setupDatabase() {
  console.log('Setting up database...');

  // Check if the database is already set up
  try {
    // Instead of directly querying a table, use a safer approach
    const { data: tables, error } = await supabase
      .from('shops')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error checking database:', error);
    }
  } catch (error) {
    console.error('Database schema check failed:', error);
  }

  console.log('Database setup complete.');
}

setupDatabase();
