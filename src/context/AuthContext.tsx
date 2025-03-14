import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const handleSession = async (session: Session | null) => {
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
          shopName: userProfile.shop_name as string || '',
          shopDescription: userProfile.shop_description as string || '',
          shopCategory: userProfile.shop_category as string || '',
          shopLocation: userProfile.shop_location as string || '',
          shopLogo: userProfile.shop_logo as string || '',
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
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              role: 'shopper',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          return { success: false, error: profileError.message };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Convert from camelCase to snake_case for database
      const dbData: any = {};
      
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
        return { success: false, error: error.message };
      }

      // Update local state
      setUser({ ...user, ...data });
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const value = {
    isLoggedIn,
    isLoading,
    user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
