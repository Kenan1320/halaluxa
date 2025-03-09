
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the user type
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url?: string | null;
  role: 'shopper' | 'business';
  // Profile fields
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  // Business specific fields
  shopName?: string | null;
  shopDescription?: string | null;
  shopCategory?: string | null;
  shopLocation?: string | null;
  shopLogo?: string | null;
  businessVerified?: boolean;
}

// Define the context type
interface AuthContextType {
  isLoggedIn: boolean;
  isInitializing: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, name: string, role: 'shopper' | 'business') => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'shopper' | 'business') => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isInitializing: true,
  user: null,
  login: async () => null,
  register: async () => false,
  signup: async () => false,
  logout: async () => {},
  updateUser: async () => false,
  refreshSession: async () => {},
  updateUserProfile: async () => false,
});

// Export the hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Initialize: check if user is already logged in
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await loadUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Helper function to load user data from DB
  const loadUserData = async (userId: string) => {
    try {
      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // If the user is a business, also get business profile
      let businessProfile = null;
      if (profile.role === 'business') {
        const { data: businessData, error: businessError } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!businessError) {
          businessProfile = businessData;
        }
      }
      
      // Safely ensure role is either 'shopper' or 'business'
      const safeRole = (profile.role === 'shopper' || profile.role === 'business') 
        ? profile.role 
        : 'shopper' as 'shopper' | 'business';
      
      // Combine profile and business profile data
      const userData: User = {
        id: userId,
        email: profile.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
        role: safeRole,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zip: profile.zip
      };
      
      // Add business fields if applicable
      if (businessProfile) {
        userData.shopName = businessProfile.shop_name;
        userData.shopDescription = businessProfile.shop_description;
        userData.shopCategory = businessProfile.shop_category;
        userData.shopLocation = businessProfile.shop_location;
        userData.shopLogo = businessProfile.shop_logo;
        userData.businessVerified = businessProfile.business_verified;
      }
      
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
      setIsLoggedIn(false);
    }
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Load user data
      await loadUserData(data.user.id);
      
      // Return the role for role-specific redirects
      return user?.role || null;
    } catch (error) {
      console.error('Error during login:', error);
      return null;
    }
  };
  
  // Register function
  const register = async (
    email: string, 
    password: string, 
    name: string,
    role: 'shopper' | 'business'
  ): Promise<boolean> => {
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });
      
      if (error) throw error;
      
      // If registration is successful but email confirmation is required
      if (data?.user && !data?.session) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
        return true;
      }
      
      // If registration is successful and user is logged in immediately
      if (data?.user && data?.session) {
        await loadUserData(data.user.id);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };
  
  // Alias for register
  const signup = register;
  
  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Update user function
  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Separate updates for profile and business_profile tables
      const profileUpdates: any = {};
      const businessUpdates: any = {};
      
      // Map user fields to profile fields
      if (updates.name !== undefined) profileUpdates.name = updates.name;
      if (updates.avatar_url !== undefined) profileUpdates.avatar_url = updates.avatar_url;
      if (updates.phone !== undefined) profileUpdates.phone = updates.phone;
      if (updates.address !== undefined) profileUpdates.address = updates.address;
      if (updates.city !== undefined) profileUpdates.city = updates.city;
      if (updates.state !== undefined) profileUpdates.state = updates.state;
      if (updates.zip !== undefined) profileUpdates.zip = updates.zip;
      
      // Map business fields to business_profile fields
      if (updates.shopName !== undefined) businessUpdates.shop_name = updates.shopName;
      if (updates.shopDescription !== undefined) businessUpdates.shop_description = updates.shopDescription;
      if (updates.shopCategory !== undefined) businessUpdates.shop_category = updates.shopCategory;
      if (updates.shopLocation !== undefined) businessUpdates.shop_location = updates.shopLocation;
      if (updates.shopLogo !== undefined) businessUpdates.shop_logo = updates.shopLogo;
      
      // Update profile if there are profile updates
      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', user.id);
        
        if (profileError) throw profileError;
      }
      
      // Update business profile if there are business updates and user is a business
      if (Object.keys(businessUpdates).length > 0 && user.role === 'business') {
        const { error: businessError } = await supabase
          .from('business_profiles')
          .update(businessUpdates)
          .eq('id', user.id);
        
        if (businessError) throw businessError;
      }
      
      // Update local user state
      setUser({
        ...user,
        ...updates,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };
  
  // Refresh session function
  const refreshSession = async (): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };
  
  // Update user profile function (alias for updateUser for compatibility)
  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    return updateUser(updates);
  };
  
  // Provide the auth context to children
  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isInitializing,
      user,
      login,
      register,
      signup,
      logout,
      updateUser,
      refreshSession,
      updateUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
