import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'shopper' | 'business';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  // Business specific fields
  shopName?: string;
  shopDescription?: string;
  shopLogo?: string;
  shopCategory?: string;
  shopLocation?: string;
}

interface ProfileUpdateData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  shopName?: string;
  shopDescription?: string;
  shopLogo?: string;
  shopCategory?: string;
  shopLocation?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<UserRole | false>;
  signup: (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole, 
    shopDetails?: {
      shopName?: string;
      shopDescription?: string;
      shopCategory?: string;
      shopLocation?: string;
      shopLogo?: string;
    }
  ) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: ProfileUpdateData) => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

const AUTH_TOKEN_KEY = 'haluna_auth_token';
const USER_DATA_KEY = 'haluna_user_data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return;
      }
      
      if (data.session) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user profile:', userError);
          return;
        }
        
        const userRole: UserRole = userData.role === 'business' ? 'business' : 'shopper';
        
        console.log('Refreshed user role from database:', userRole);
        
        const userObj: User = {
          id: userData.id,
          name: userData.name || data.session.user.email?.split('@')[0] || 'User',
          email: data.session.user.email || '',
          role: userRole,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          zip: userData.zip,
          shopName: userData.shop_name,
          shopDescription: userData.shop_description,
          shopLogo: userData.shop_logo,
          shopCategory: userData.shop_category,
          shopLocation: userData.shop_location,
        };
        
        setUser(userObj);
        setIsLoggedIn(true);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userObj));
        
        console.log('Session refreshed, user role:', userObj.role);
      }
    } catch (error) {
      console.error('Refresh session error:', error);
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        
        if (data.session) {
          await refreshSession();
        } else {
          const storedUserJson = localStorage.getItem(USER_DATA_KEY);
          
          if (storedUserJson) {
            try {
              localStorage.removeItem(USER_DATA_KEY);
            } catch (error) {
              console.error('Failed to parse stored user data', error);
            }
          }
        }
      } catch (error) {
        console.error('Initial auth check error:', error);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  const login = async (email: string, password: string): Promise<UserRole | false> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      if (data.session) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
          
        if (userError && userError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', userError);
          
          const basicUser: User = {
            id: data.session.user.id,
            name: data.session.user.email?.split('@')[0] || 'User',
            email: data.session.user.email || '',
            role: 'shopper',
          };
          
          setUser(basicUser);
          setIsLoggedIn(true);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(basicUser));
          return 'shopper';
        }
        
        if (userData) {
          const userRole: UserRole = userData.role === 'business' ? 'business' : 'shopper';
            
          console.log('User logging in with role from database:', userRole);
            
          const userObj: User = {
            id: userData.id,
            name: userData.name || data.session.user.email?.split('@')[0] || 'User',
            email: data.session.user.email || '',
            role: userRole,
            phone: userData.phone,
            address: userData.address,
            city: userData.city,
            state: userData.state,
            zip: userData.zip,
            shopName: userData.shop_name,
            shopDescription: userData.shop_description,
            shopLogo: userData.shop_logo,
            shopCategory: userData.shop_category,
            shopLocation: userData.shop_location,
          };
          
          console.log('User logged in with role:', userRole);
          
          setUser(userObj);
          setIsLoggedIn(true);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(userObj));
          return userObj.role;
        } else {
          const basicUser: User = {
            id: data.session.user.id,
            name: data.session.user.email?.split('@')[0] || 'User',
            email: data.session.user.email || '',
            role: 'shopper',
          };
          
          await supabase.from('profiles').insert({
            id: data.session.user.id,
            name: basicUser.name,
            email: basicUser.email,
            role: 'shopper',
          });
          
          setUser(basicUser);
          setIsLoggedIn(true);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(basicUser));
          return 'shopper';
        }
      }
      
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole,
    shopDetails?: {
      shopName?: string;
      shopDescription?: string;
      shopCategory?: string;
      shopLocation?: string;
      shopLogo?: string;
    }
  ): Promise<boolean> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) {
        console.error('Auth signup error:', authError);
        toast({
          title: "Signup Failed",
          description: authError.message,
          variant: "destructive",
        });
        return false;
      }
      
      if (!authData.user) {
        toast({
          title: "Signup Failed",
          description: "User registration failed. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      const profileData = {
        id: authData.user.id,
        name,
        email,
        role,
        ...(role === 'business' && shopDetails ? {
          shop_name: shopDetails.shopName || '',
          shop_description: shopDetails.shopDescription || '',
          shop_category: shopDetails.shopCategory || '',
          shop_location: shopDetails.shopLocation || '',
          shop_logo: shopDetails.shopLogo || '',
        } : {})
      };
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData);
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        toast({
          title: "Profile Creation Warning",
          description: "Your account was created but we couldn't set up your profile completely. Some features may be limited.",
          variant: "destructive",
        });
      }
      
      if (role === 'business' && shopDetails?.shopName) {
        const { error: shopError } = await supabase
          .from('shops')
          .insert({
            id: authData.user.id,
            name: shopDetails.shopName,
            description: shopDetails.shopDescription || 'New shop on Haluna',
            owner_id: authData.user.id,
            location: shopDetails.shopLocation || 'Online',
            logo_url: shopDetails.shopLogo || null,
          });
        
        if (shopError) {
          console.error('Shop creation error:', shopError);
          toast({
            title: "Shop Creation Warning",
            description: "Your account was created but there was an issue setting up your shop. You can set it up later in your dashboard.",
            variant: "destructive",
          });
        }
      }
      
      const userObj: User = {
        id: authData.user.id,
        name,
        email,
        role,
        ...(role === 'business' && shopDetails ? {
          shopName: shopDetails.shopName || '',
          shopDescription: shopDetails.shopDescription || '',
          shopCategory: shopDetails.shopCategory || '',
          shopLocation: shopDetails.shopLocation || '',
          shopLogo: shopDetails.shopLogo || '',
        } : {})
      };
      
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userObj));
      setUser(userObj);
      setIsLoggedIn(true);
      
      toast({
        title: "Welcome to Haluna!",
        description: `Your account has been created successfully${role === 'business' ? ' and your shop is now live!' : '.'}`,
      });
      
      return true;
    } catch (error) {
      console.error('Signup failed', error);
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const updateUserProfile = async (data: ProfileUpdateData): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zip: data.zip,
          ...(user.role === 'business' ? {
            shop_name: data.shopName,
            shop_description: data.shopDescription,
            shop_logo: data.shopLogo,
            shop_category: data.shopCategory,
            shop_location: data.shopLocation,
          } : {})
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Profile update error:', updateError);
        toast({
          title: "Update Failed",
          description: "There was an error updating your profile. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      if (user.role === 'business' && (data.shopName || data.shopDescription || data.shopLogo || data.shopCategory || data.shopLocation)) {
        const { error: shopUpdateError } = await supabase
          .from('shops')
          .update({
            name: data.shopName,
            description: data.shopDescription,
            logo_url: data.shopLogo,
            location: data.shopLocation,
          })
          .eq('owner_id', user.id);
        
        if (shopUpdateError) {
          console.error('Shop update error:', shopUpdateError);
          toast({
            title: "Shop Update Warning",
            description: "Your profile was updated but there was an issue updating your shop details.",
            variant: "destructive",
          });
        }
      }
      
      const updatedUser = {
        ...user,
        ...data
      };
      
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      
      const usersStr = localStorage.getItem('users');
      if (usersStr) {
        let users = JSON.parse(usersStr);
        users = users.map((u: any) => {
          if (u.id === user.id) {
            return { ...u, ...data };
          }
          return u;
        });
        
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      setUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Profile update failed', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_DATA_KEY);
      navigate('/');
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn, 
      login, 
      signup, 
      logout,
      updateUserProfile,
      refreshSession
    }}>
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
