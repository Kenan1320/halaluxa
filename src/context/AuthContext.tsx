
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the user type
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar?: string | null;
  role: 'shopper' | 'business';
}

// Define the context type
interface AuthContextType {
  isLoggedIn: boolean;
  isInitializing: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, name: string, role: 'shopper' | 'business') => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isInitializing: true,
  user: null,
  login: async () => null,
  register: async () => false,
  logout: async () => {},
  updateUser: async () => false,
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
          // Get user profile from the database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || session.user.user_metadata?.full_name || null,
              avatar: session.user.user_metadata?.avatar_url || null,
              role: profile.role as 'shopper' | 'business',
            });
            setIsLoggedIn(true);
          }
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
        // Get user profile from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          // Check if this was a social sign-in and we need to update the role
          const storedUserType = localStorage.getItem('signupUserType');
          if (storedUserType && (storedUserType === 'shopper' || storedUserType === 'business')) {
            // Update the role in the database
            await supabase
              .from('profiles')
              .update({ role: storedUserType })
              .eq('id', session.user.id);
            
            // Update the local profile object
            profile.role = storedUserType;
            
            // Clear the stored user type
            localStorage.removeItem('signupUserType');
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile.name || session.user.user_metadata?.full_name || null,
            avatar: session.user.user_metadata?.avatar_url || null,
            role: profile.role as 'shopper' | 'business',
          });
          setIsLoggedIn(true);
        }
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
  
  // Login function
  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profile) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: profile.name || null,
          role: profile.role as 'shopper' | 'business',
        });
        
        setIsLoggedIn(true);
        return profile.role;
      }
      
      return null;
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
        // Get or create user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          // Error other than "not found"
          throw profileError;
        }
        
        // If profile doesn't exist, it should have been created by the database trigger
        // But we'll update it with the name and role just to be sure
        if (!profile) {
          await supabase
            .from('profiles')
            .update({ name, role })
            .eq('id', data.user.id);
        }
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name,
          role,
        });
        
        setIsLoggedIn(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }
  };
  
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
      // Update user in database
      const { error } = await supabase
        .from('profiles')
        .update(updates)
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
  
  // Provide the auth context to children
  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isInitializing,
      user,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
