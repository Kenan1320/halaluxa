
import { supabase } from '@/integrations/supabase/client';

// Create SQL functions directly in the database
export const setupDatabaseTables = async (): Promise<void> => {
  console.log('Setting up database tables...');
  
  // First, check if the function exists
  try {
    // For now, we'll handle this by just catching errors
    // and proceeding with the setup
    console.log('Checking for database functions...');
    
    // Define SQL for user shop preferences function
    const createUserShopPreferencesSQL = `
      CREATE OR REPLACE FUNCTION get_user_shop_preferences(user_id_param UUID)
      RETURNS TABLE (
        id UUID,
        user_id UUID,
        shop_id UUID,
        is_following BOOLEAN,
        is_favorite BOOLEAN,
        is_main_shop BOOLEAN,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ
      )
      LANGUAGE SQL
      AS $$
        SELECT 
          id, 
          user_id, 
          shop_id, 
          is_following, 
          is_favorite, 
          is_main_shop,
          created_at,
          updated_at
        FROM user_shop_preferences
        WHERE user_id = user_id_param;
      $$;
    `;
    
    const createUpdateUserShopPreferenceSQL = `
      CREATE OR REPLACE FUNCTION update_user_shop_preference(
        p_user_id UUID,
        p_shop_id UUID,
        p_is_following BOOLEAN,
        p_is_favorite BOOLEAN,
        p_is_main_shop BOOLEAN
      )
      RETURNS JSON
      LANGUAGE plpgsql
      AS $$
      DECLARE
        result JSON;
      BEGIN
        -- Update the preference if it exists
        UPDATE user_shop_preferences
        SET 
          is_following = p_is_following,
          is_favorite = p_is_favorite,
          is_main_shop = p_is_main_shop,
          updated_at = NOW()
        WHERE user_id = p_user_id AND shop_id = p_shop_id
        RETURNING to_json(user_shop_preferences) INTO result;
        
        -- If no rows were affected, the preference doesn't exist
        IF result IS NULL THEN
          RETURN json_build_object('error', 'Preference not found');
        END IF;
        
        RETURN result;
      END;
      $$;
    `;
    
    const createInsertUserShopPreferenceSQL = `
      CREATE OR REPLACE FUNCTION insert_user_shop_preference(
        p_user_id UUID,
        p_shop_id UUID,
        p_is_following BOOLEAN,
        p_is_favorite BOOLEAN,
        p_is_main_shop BOOLEAN
      )
      RETURNS JSON
      LANGUAGE plpgsql
      AS $$
      DECLARE
        result JSON;
        new_id UUID;
      BEGIN
        -- Insert the new preference
        INSERT INTO user_shop_preferences (
          user_id, 
          shop_id, 
          is_following, 
          is_favorite, 
          is_main_shop
        )
        VALUES (
          p_user_id,
          p_shop_id,
          p_is_following,
          p_is_favorite,
          p_is_main_shop
        )
        RETURNING id INTO new_id;
        
        -- Get the inserted row as JSON
        SELECT to_json(user_shop_preferences)
        FROM user_shop_preferences
        WHERE id = new_id
        INTO result;
        
        RETURN result;
      END;
      $$;
    `;
    
    // Execute the SQL to create the functions
    const { error: error1 } = await supabase.rpc('exec_sql', { sql: createUserShopPreferencesSQL });
    const { error: error2 } = await supabase.rpc('exec_sql', { sql: createUpdateUserShopPreferenceSQL });
    const { error: error3 } = await supabase.rpc('exec_sql', { sql: createInsertUserShopPreferenceSQL });
    
    if (error1 || error2 || error3) {
      console.error('Error setting up database functions:', error1 || error2 || error3);
    } else {
      console.log('Database functions set up successfully');
    }
  } catch (error) {
    console.error('Error in database setup:', error);
  }
};
