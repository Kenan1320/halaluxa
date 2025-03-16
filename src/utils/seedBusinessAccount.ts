
import { supabase } from '@/integrations/supabase/client';

// This function is for development purposes only
export const ensureBusinessAccount = async () => {
  const email = 'abdu2000mutwakil@gmail.com';
  const password = 'HalunaTest2024!'; // You should change this after development
  
  try {
    // Check if the user already exists
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);
    
    if (!existingUsers || existingUsers.length === 0) {
      // If the user doesn't exist, create it
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: 'Abdul Test Account',
            role: 'business',
            is_verified: true,
          }
        }
      });
      
      if (signUpError) {
        console.error('Error creating business account:', signUpError);
      } else {
        console.log('Business account created successfully');
        
        // Create a shop for the business account
        await supabase.from('shops').insert({
          name: 'Abdul\'s Test Shop',
          description: 'This is a test shop for development purposes',
          category: 'Food & Groceries',
          location: 'Test Location',
          owner_id: userData.user?.id,
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          rating: 5,
          product_count: 0
        });
      }
    } else {
      // If the user exists, update its role to business
      const userId = existingUsers[0].id;
      
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role: 'business', is_verified: true },
      });
      
      // Also update profile table
      await supabase
        .from('profiles')
        .update({ 
          role: 'business',
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      console.log('Business account updated successfully');
    }
    
    console.log('Business account credentials:');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error ensuring business account:', error);
  }
};

// Run this in development environment
if (import.meta.env.DEV) {
  ensureBusinessAccount();
}
