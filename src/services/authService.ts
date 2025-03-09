
import { supabase } from '@/integrations/supabase/client';
import { BusinessSignupFormData } from '@/models/shop';

// Business signup function
export const businessSignup = async (data: BusinessSignupFormData) => {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          is_business_owner: true
        }
      }
    });

    if (authError) {
      console.error('Auth error during business signup:', authError);
      return { success: false, error: authError.message };
    }

    // If auth was successful, create the business profile
    if (authData && authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          is_business_owner: true,
          shop_name: data.businessName,
          shop_category: data.businessCategory,
          shop_description: data.businessDescription,
          shop_location: data.location
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Profile error during business signup:', profileError);
        return { success: false, error: profileError.message };
      }

      // Create the shop
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .insert({
          name: data.businessName,
          description: data.businessDescription,
          category: data.businessCategory,
          location: data.location,
          owner_id: authData.user.id
        })
        .select()
        .single();

      if (shopError) {
        console.error('Shop error during business signup:', shopError);
        return { success: false, error: shopError.message };
      }

      // Update the profile with the shop ID
      await supabase
        .from('profiles')
        .update({
          main_shop_id: shopData.id
        })
        .eq('id', authData.user.id);

      return { success: true, user: authData.user };
    }

    return { success: false, error: 'Signup failed' };
  } catch (error: any) {
    console.error('Error in businessSignup:', error);
    return { success: false, error: error.message };
  }
};

// Business login function
export const businessLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    console.error('Error in businessLogin:', error);
    return { success: false, error: error.message };
  }
};

// Business logout function
export const businessLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in businessLogout:', error);
    return { success: false, error: error.message };
  }
};
