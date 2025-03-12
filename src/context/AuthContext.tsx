
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { DatabaseProfile } from '@/types/database';

interface User {
  id: string;
  email: string;
  name: string;
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
  login: (email: string, password: string) => Promise<string | undefined>;
  signup: (email: string, password: string, name: string, role: 'shopper' | 'business') => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<boolean>;
  updateBusinessProfile: (profile: Partial<User>) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'shopper' | 'business') => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
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
    }
  };
  
  const login = async (email: string, password: string): Promise<string | undefined> => {
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
        return user?.role;
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
    return undefined;
  };
  
  const signup = async (email: string, password: string, name: string, role: 'shopper' | 'business') => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
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
  
  const register = async (email: string, password: string, name: string, role: 'shopper' | 'business') => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
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
          title: "Registration successful",
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
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  const updateUserProfile = async (profile: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    try {
      setIsLoading(true);
      
      const dbProfile: Partial<DatabaseProfile> = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        zip: profile.zip,
        avatar_url: profile.avatar_url,
        shop_name: profile.shop_name,
        shop_description: profile.shop_description,
        shop_category: profile.shop_category,
        shop_location: profile.shop_location,
        shop_logo: profile.shop_logo,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setUser(prev => prev ? { ...prev, ...profile } : null);
      
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
  
  const updateBusinessProfile = async (profile: Partial<User>) => {
    if (!user) return;
    
    if (user.role !== 'business') {
      toast({
        title: "Access denied",
        description: "Only business users can update business profiles",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const dbProfile: Partial<DatabaseProfile> = {
        shop_name: profile.shop_name,
        shop_description: profile.shop_description,
        shop_category: profile.shop_category,
        shop_location: profile.shop_location,
        shop_logo: profile.shop_logo,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      setUser(prev => prev ? { ...prev, ...profile } : null);
      
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
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
