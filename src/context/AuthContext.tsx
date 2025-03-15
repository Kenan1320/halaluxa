import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { DatabaseProfile, Product } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: DatabaseProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<DatabaseProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setIsLoggedIn(true);
          await refreshUser();
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        refreshUser();
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;

      toast({
        title: 'Check your email',
        description: 'We have sent you a magic link to log in.',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'There was an error logging in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        options: {
          data: {
            name,
            role: 'shopper',
          },
        },
      });
      if (error) throw error;

      toast({
        title: 'Check your email',
        description: 'We have sent you a confirmation link to verify your account.',
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup failed',
        description: 'There was an error signing up. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setIsLoggedIn(false);
      setUser(null);
      navigate('/login');

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout failed',
        description: 'There was an error logging out. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      if (supaUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supaUser.id)
          .single();

        if (error) throw error;

        setUser(profile as DatabaseProfile);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsLoggedIn(false);
      setUser(null);
      toast({
        title: 'Failed to load profile',
        description: 'There was an error loading your profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Update these functions to properly handle shop fields
const updateUser = async (updates: any): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);
    
    if (error) throw error;
    
    if (updates.shop_name || updates.shop_description || updates.shop_category || 
        updates.shop_location || updates.shop_logo) {
      // If shop fields are included, we need to update those separately
      await updateShopFields({
        shop_name: updates.shop_name,
        shop_description: updates.shop_description,
        shop_category: updates.shop_category,
        shop_location: updates.shop_location,
        shop_logo: updates.shop_logo
      });
    }
    
    // Refresh user data
    await refreshUser();
    
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated.',
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    toast({
      title: 'Update failed',
      description: 'There was an error updating your profile. Please try again.',
      variant: 'destructive',
    });
    return false;
  }
};

const updateShopFields = async (shopUpdates: {
  shop_name?: string;
  shop_description?: string;
  shop_category?: string;
  shop_location?: string;
  shop_logo?: string;
}): Promise<boolean> => {
  if (!user) return false;
  
  try {
    const { data, error } = await supabase
      .from('shop_fields')
      .upsert({
        user_id: user.id,
        ...shopUpdates,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating shop fields:', error);
    return false;
  }
};

// Helper function to transform product data
const normalizeProduct = (product: any): Product => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    shop_id: product.shop_id,
    category: product.category,
    images: product.images || [],
    created_at: product.created_at,
    updated_at: product.updated_at,
    is_halal_certified: product.is_halal_certified || false,
    in_stock: product.in_stock || true,
    details: product.details || {},
    long_description: product.long_description || '',
    is_published: product.is_published || true,
    stock: product.stock || 10,
    seller_id: product.seller_id || '',
    rating: product.rating || 0,
    shop_name: product.shop_name || '',
    delivery_mode: product.delivery_mode || 'online',
    pickup_options: product.pickup_options || {
      store: true,
      curbside: false
    }
  };
};

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    login,
    signUp,
    logout,
    refreshUser,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
