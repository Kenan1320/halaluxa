
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AuthContextType, UserProfile } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for active session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSession = async (session: any) => {
    if (session && session.user) {
      try {
        // Fetch user profile from the database
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          throw error;
        }

        // Update user context with profile data
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: userProfile.name || '',
          role: userProfile.role || 'shopper',
          avatar: userProfile.avatar_url || '',
          phone: userProfile.phone || '',
          address: userProfile.address || '',
          city: userProfile.city || '',
          state: userProfile.state || '',
          zip: userProfile.zip || '',
          shopName: userProfile.shop_name || '',
          shopDescription: userProfile.shop_description || '',
          shopCategory: userProfile.shop_category || '',
          shopLocation: userProfile.shop_location || '',
          shopLogo: userProfile.shop_logo || ''
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      if (data.user) {
        // Create profile record
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            name,
            email,
            role: 'shopper',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

        if (profileError) {
          return {
            success: false,
            error: profileError.message
          };
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    try {
      // Convert from camelCase to snake_case for database
      const dbData: Partial<UserProfile> = {};
      if (data.name) dbData.name = data.name;
      if (data.phone) dbData.phone = data.phone;
      if (data.address) dbData.address = data.address;
      if (data.city) dbData.city = data.city;
      if (data.state) dbData.state = data.state;
      if (data.zip) dbData.zip = data.zip;
      if (data.avatar) dbData.avatar_url = data.avatar;
      if (data.shopName) dbData.shop_name = data.shopName;
      if (data.shopDescription) dbData.shop_description = data.shopDescription;
      if (data.shopCategory) dbData.shop_category = data.shopCategory;
      if (data.shopLocation) dbData.shop_location = data.shopLocation;
      if (data.shopLogo) dbData.shop_logo = data.shopLogo;
      
      dbData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', user.id);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Update local state
      setUser({
        ...user,
        ...data
      });

      return { success: true };
    } catch (error: any) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred'
      };
    }
  };

  // Aliases for updateProfile to match different naming conventions used in the app
  const updateUser = updateProfile;
  const updateUserProfile = updateProfile;
  
  // Alias for signup to match different naming conventions
  const register = signup;

  const value: AuthContextType = {
    isLoggedIn,
    isLoading,
    user,
    login,
    signup,
    logout,
    updateProfile,
    updateUser,
    register,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
