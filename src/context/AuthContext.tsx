
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, BusinessProfile } from '@/models/user';

// Define the context type
interface AuthContextType {
  isLoggedIn: boolean;
  isInitializing: boolean;
  user: User | null;
  businessProfile: BusinessProfile | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, name: string, role: 'shopper' | 'business') => Promise<boolean>;
  googleSignIn: (role: 'shopper' | 'business') => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
  refreshSession: () => Promise<void>;
  updateBusinessProfile: (updates: Partial<BusinessProfile>) => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isInitializing: true,
  user: null,
  businessProfile: null,
  login: async () => null,
  register: async () => false,
  googleSignIn: async () => {},
  logout: async () => {},
  updateUser: async () => false,
  refreshSession: async () => {},
  updateBusinessProfile: async () => false,
});

// Export the hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const { toast } = useToast();
  
  // Initialize: check if user is already logged in
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsInitializing(false);
      }
    };
    
    initializeAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile from database
        await fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
        setBusinessProfile(null);
      }
    });
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user data from the database
  const fetchUserData = async (userId: string) => {
    try {
      // Get user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (profile) {
        const userData: User = {
          id: userId,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar_url,
          role: profile.role as 'shopper' | 'business',
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          zip: profile.zip,
          createdAt: profile.created_at,
        };
        
        setUser(userData);
        setIsLoggedIn(true);
        
        // If the user is a business owner, fetch their business profile
        if (profile.role === 'business') {
          const { data: businessData, error: businessError } = await supabase
            .from('business_profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (!businessError && businessData) {
            setBusinessProfile({
              id: businessData.id,
              shopName: businessData.shop_name,
              shopDescription: businessData.shop_description,
              shopLogo: businessData.shop_logo,
              shopCategory: businessData.shop_category,
              shopLocation: businessData.shop_location,
              businessVerified: businessData.business_verified,
              businessDocuments: businessData.business_documents || {},
              createdAt: businessData.created_at,
              updatedAt: businessData.updated_at,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsInitializing(false);
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
      
      await fetchUserData(data.user.id);
      
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
        await fetchUserData(data.user.id);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };
  
  // Google Sign In
  const googleSignIn = async (role: 'shopper' | 'business') => {
    try {
      // Store the role in local storage temporarily
      localStorage.setItem('signup_role', role);
      
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
          queryParams: {
            role: role, // Pass the role as a query parameter
          },
        },
      });
    } catch (error) {
      console.error('Error during Google sign in:', error);
      toast({
        title: "Error",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
      setBusinessProfile(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Update user function
  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Prepare updates for the profiles table
      const dbUpdates: any = {};
      
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.city !== undefined) dbUpdates.city = updates.city;
      if (updates.state !== undefined) dbUpdates.state = updates.state;
      if (updates.zip !== undefined) dbUpdates.zip = updates.zip;
      
      // Update user in database
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);
      
      if (error) throw error;
      
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
  
  // Update business profile
  const updateBusinessProfile = async (updates: Partial<BusinessProfile>): Promise<boolean> => {
    if (!user || user.role !== 'business' || !businessProfile) return false;
    
    try {
      // Prepare updates for the business_profiles table
      const dbUpdates: any = {};
      
      if (updates.shopName !== undefined) dbUpdates.shop_name = updates.shopName;
      if (updates.shopDescription !== undefined) dbUpdates.shop_description = updates.shopDescription;
      if (updates.shopLogo !== undefined) dbUpdates.shop_logo = updates.shopLogo;
      if (updates.shopCategory !== undefined) dbUpdates.shop_category = updates.shopCategory;
      if (updates.shopLocation !== undefined) dbUpdates.shop_location = updates.shopLocation;
      if (updates.businessDocuments !== undefined) dbUpdates.business_documents = updates.businessDocuments;
      
      // Update business profile in database
      const { error } = await supabase
        .from('business_profiles')
        .update(dbUpdates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local business profile state
      setBusinessProfile({
        ...businessProfile,
        ...updates,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating business profile:', error);
      return false;
    }
  };
  
  // Refresh session function
  const refreshSession = async (): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };
  
  // Provide the auth context to children
  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isInitializing,
      user,
      businessProfile,
      login,
      register,
      googleSignIn,
      logout,
      updateUser,
      refreshSession,
      updateBusinessProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
