import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DatabaseProfile } from '@/types/database';

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
  login: (email: string, password: string) => Promise<string | null>;
  signup: (email: string, password: string, name: string, role: 'shopper' | 'business') => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<boolean>;
  updateBusinessProfile: (businessProfile: Partial<User>) => Promise<boolean>;
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
        const userProfile: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as 'shopper' | 'business' | 'admin',
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          avatar_url: data.avatar_url,
          shop_name: data.shop_name,
          shop_description: data.shop_description,
          shop_category: data.shop_category,
          shop_location: data.shop_location,
          shop_logo: data.shop_logo,
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
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        await fetchAndSetUserProfile(data.user.id);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/');
        
        return profileData?.role || null;
      }
      return null;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      return null;
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
    if (!user) return false;
    
    try {
      setIsLoading(true);
      
      // Convert profile data to database format
      const dbProfile: Partial<DatabaseProfile> = {};
      
      if (profile.name !== undefined) dbProfile.name = profile.name;
      if (profile.email !== undefined) dbProfile.email = profile.email;
      if (profile.phone !== undefined) dbProfile.phone = profile.phone;
      if (profile.address !== undefined) dbProfile.address = profile.address;
      if (profile.city !== undefined) dbProfile.city = profile.city;
      if (profile.state !== undefined) dbProfile.state = profile.state;
      if (profile.zip !== undefined) dbProfile.zip = profile.zip;
      if (profile.avatar_url !== undefined) dbProfile.avatar_url = profile.avatar_url;
      if (profile.shop_name !== undefined) dbProfile.shop_name = profile.shop_name;
      if (profile.shop_description !== undefined) dbProfile.shop_description = profile.shop_description;
      if (profile.shop_category !== undefined) dbProfile.shop_category = profile.shop_category;
      if (profile.shop_location !== undefined) dbProfile.shop_location = profile.shop_location;
      if (profile.shop_logo !== undefined) dbProfile.shop_logo = profile.shop_logo;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
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

      return true;
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update business profile (shop owner)
  const updateBusinessProfile = async (businessProfile: Partial<User>) => {
    if (!user || user.role !== 'business') return false;
    
    try {
      setIsLoading(true);
      
      const dbProfile: Partial<DatabaseProfile> = {};
      
      if (businessProfile.shop_name !== undefined) dbProfile.shop_name = businessProfile.shop_name;
      if (businessProfile.shop_description !== undefined) dbProfile.shop_description = businessProfile.shop_description;
      if (businessProfile.shop_category !== undefined) dbProfile.shop_category = businessProfile.shop_category;
      if (businessProfile.shop_location !== undefined) dbProfile.shop_location = businessProfile.shop_location;
      if (businessProfile.shop_logo !== undefined) dbProfile.shop_logo = businessProfile.shop_logo;
      
      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
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

      return true;
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your business profile",
        variant: "destructive",
      });
      return false;
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
