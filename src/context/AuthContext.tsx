import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DatabaseProfile } from '@/types/database';

// Define extended DatabaseProfile that includes shop properties
interface ExtendedDatabaseProfile extends DatabaseProfile {
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
}

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'shopper' | 'business' | 'admin';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  avatar_url?: string;
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'shopper' | 'business') => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  updateBusinessProfile: (businessProfile: Partial<User>) => Promise<void>;
  updateUser: (updates: any) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        setIsInitializing(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (session?.user) {
          await fetchAndSetUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
        setIsInitializing(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchAndSetUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Fetch and set user profile from database
  const fetchAndSetUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const dbProfile = data as ExtendedDatabaseProfile;
        
        const userProfile: User = {
          id: dbProfile.id,
          name: dbProfile.name,
          email: dbProfile.email,
          role: dbProfile.role as 'shopper' | 'business' | 'admin',
          phone: dbProfile.phone,
          address: dbProfile.address,
          city: dbProfile.city,
          state: dbProfile.state,
          zip: dbProfile.zip,
          avatar_url: dbProfile.avatar_url,
          shop_name: dbProfile.shop_name,
          shop_description: dbProfile.shop_description,
          shop_category: dbProfile.shop_category,
          shop_location: dbProfile.shop_location,
          shop_logo: dbProfile.shop_logo,
        };
        
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
      setIsInitializing(false);
    }
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        await fetchAndSetUserProfile(data.user.id);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Signup function
  const signup = async (email: string, password: string, name: string, role: 'shopper' | 'business') => {
    try {
      setIsLoading(true);
      
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Create profile in our database
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              role,
            },
          ]);
        
        if (profileError) {
          throw profileError;
        }
        
        await fetchAndSetUserProfile(data.user.id);
        
        toast({
          title: "Signup successful",
          description: "Your account has been created!",
        });
        
        if (role === 'business') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user profile
  const updateUserProfile = async (profile: Partial<User>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local user state
      setUser((prev) => prev ? { ...prev, ...profile } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update business profile (shop owner)
  const updateBusinessProfile = async (businessProfile: Partial<User>) => {
    if (!user || user.role !== 'business') return;
    
    try {
      setIsLoading(true);
      
      // Make sure we're using the proper field names for the database
      const shopUpdate = {
        shop_name: businessProfile.shop_name,
        shop_description: businessProfile.shop_description,
        shop_category: businessProfile.shop_category,
        shop_location: businessProfile.shop_location,
        shop_logo: businessProfile.shop_logo,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(shopUpdate)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local user state
      setUser((prev) => prev ? { ...prev, ...businessProfile } : null);
      
      toast({
        title: "Business profile updated",
        description: "Your business profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your business profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user - general purpose update function for ShopSetupForm
  const updateUser = async (updates: any) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Map the camelCase keys to snake_case for the database
      const dbUpdates = {
        shop_name: updates.shopName,
        shop_description: updates.shopDescription,
        shop_category: updates.shopCategory,
        shop_location: updates.shopLocation,
        shop_logo: updates.shopLogo,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update local user state with snake_case keys to match our User interface
      setUser(prev => prev ? {
        ...prev,
        shop_name: updates.shopName,
        shop_description: updates.shopDescription,
        shop_category: updates.shopCategory,
        shop_location: updates.shopLocation,
        shop_logo: updates.shopLogo,
      } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn: !!user, 
        isLoading,
        isInitializing,
        login, 
        signup, 
        logout, 
        updateUserProfile,
        updateBusinessProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
