
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/models/shop';

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  error?: any;
}

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Fetch additional user data from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.warn('Profile not found:', profileError);
    }

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      role: profile?.role || 'shopper',
      name: profile?.name || '',
    };

    return {
      success: true,
      message: 'Logged in successfully',
      user,
    };
  } catch (error: any) {
    console.error('Error signing in:', error);
    return {
      success: false,
      message: error.message || 'Failed to sign in',
      error,
    };
  }
};

export const signUp = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name, role: 'shopper' })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        role: 'shopper',
        name,
      };

      return {
        success: true,
        message: 'Account created successfully',
        user,
      };
    } else {
      return {
        success: false,
        message: 'Account created but user data missing',
      };
    }
  } catch (error: any) {
    console.error('Error signing up:', error);
    return {
      success: false,
      message: error.message || 'Failed to create account',
      error,
    };
  }
};

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return {
      success: false,
      message: error.message || 'Failed to log out',
      error,
    };
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return null;
    }

    // Fetch additional user data from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();

    if (profileError) {
      console.warn('Profile not found:', profileError);
    }

    const user: AuthUser = {
      id: data.session.user.id,
      email: data.session.user.email || '',
      role: profile?.role || 'shopper',
      name: profile?.name || '',
    };

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<AuthResponse> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      message: error.message || 'Failed to update profile',
      error,
    };
  }
};

export const createBusinessAccount = async (
  email: string, 
  password: string, 
  name: string, 
  businessDetails: {
    businessName: string,
    businessCategory: string,
    businessDescription: string,
    location: string,
    phone?: string
  }
): Promise<AuthResponse> => {
  try {
    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Update the profile with business details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name,
          role: 'business',
          is_business_owner: true,
          phone: businessDetails.phone,
          shop_name: businessDetails.businessName,
          shop_category: businessDetails.businessCategory,
          shop_description: businessDetails.businessDescription,
          shop_location: businessDetails.location
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Error updating business profile:', profileError);
        throw profileError;
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email || '',
        role: 'business',
        name,
      };

      return {
        success: true,
        message: 'Business account created successfully',
        user,
      };
    } else {
      return {
        success: false,
        message: 'Business account created but user data missing',
      };
    }
  } catch (error: any) {
    console.error('Error creating business account:', error);
    return {
      success: false,
      message: error.message || 'Failed to create business account',
      error,
    };
  }
};

export const resetPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Password reset email sent',
    };
  } catch (error: any) {
    console.error('Error sending reset password email:', error);
    return {
      success: false,
      message: error.message || 'Failed to send reset password email',
      error,
    };
  }
};

export const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error: any) {
    console.error('Error updating password:', error);
    return {
      success: false,
      message: error.message || 'Failed to update password',
      error,
    };
  }
};
