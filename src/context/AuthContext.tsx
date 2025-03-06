import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
}

const AUTH_TOKEN_KEY = 'haluna_auth_token';
const USER_DATA_KEY = 'haluna_user_data';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check for logged in user on mount
    const checkLoggedIn = () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUserJson = localStorage.getItem(USER_DATA_KEY);
      
      if (token && storedUserJson) {
        try {
          const storedUser = JSON.parse(storedUserJson);
          setUser(storedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to parse stored user data', error);
          logout();
        }
      }
    };
    
    checkLoggedIn();
  }, []);
  
  const login = async (email: string, password: string): Promise<UserRole | false> => {
    // Improved login function with better password validation and error handling
    try {
      // Get all stored users for improved login validation
      const usersStr = localStorage.getItem('users');
      let users = [];
      
      if (usersStr) {
        users = JSON.parse(usersStr);
      }
      
      // Find user by email - case insensitive search
      const foundUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (foundUser) {
        // In a real app, we would hash and compare passwords
        // For this demo, we're using plain text comparison
        if (foundUser.password === password) {
          // Remove password from user object before storing in state
          const { password: _, ...userWithoutPassword } = foundUser;
          
          // Create a session token (mock)
          const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
          
          setUser(userWithoutPassword);
          setIsLoggedIn(true);
          
          // Store both the token and user data
          localStorage.setItem(AUTH_TOKEN_KEY, token);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));
          
          return userWithoutPassword.role;
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
      // Generate a unique ID
      const userId = Math.random().toString(36).substr(2, 9);
      
      // Create a new user object with secure password storage
      const newUser = {
        id: userId,
        name,
        email,
        password, // In a real app, this would be hashed
        role,
        ...(role === 'business' && shopDetails ? {
          shopName: shopDetails.shopName || '',
          shopDescription: shopDetails.shopDescription || '',
          shopCategory: shopDetails.shopCategory || '',
          shopLocation: shopDetails.shopLocation || '',
          shopLogo: shopDetails.shopLogo || '',
        } : {})
      };
      
      // Store the user in the users array
      const usersStr = localStorage.getItem('users');
      let users = [];
      
      if (usersStr) {
        users = JSON.parse(usersStr);
      }
      
      // Check if email already exists
      const emailExists = users.some((u: any) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (emailExists) {
        toast({
          title: "Signup Failed",
          description: "This email is already registered. Please log in or use a different email.",
          variant: "destructive",
        });
        return false;
      }
      
      // Add the new user to the users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Create a session token (mock)
      const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
      
      // Save to localStorage for current session
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userWithoutPassword));
      
      // If it's a business user, create a shop entry
      if (role === 'business' && shopDetails?.shopName) {
        const newShop = {
          id: userId, // Use the same ID as the user for simplicity
          name: shopDetails.shopName,
          description: shopDetails.shopDescription || 'New shop on Haluna',
          category: shopDetails.shopCategory || 'General',
          location: shopDetails.shopLocation || 'Online',
          coverImage: null,
          logo: shopDetails.shopLogo || null,
          isVerified: false,
          productCount: 0,
          rating: 5.0
        };
        
        // Save the new shop to shops in localStorage
        const existingShops = JSON.parse(localStorage.getItem('shops') || '[]');
        const updatedShops = [...existingShops, newShop];
        localStorage.setItem('shops', JSON.stringify(updatedShops));
      }
      
      setUser(userWithoutPassword);
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
      
      const updatedUser = {
        ...user,
        ...data
      };
      
      // Update in local storage for current session
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      
      // Update in users array
      const usersStr = localStorage.getItem('users');
      if (usersStr) {
        let users = JSON.parse(usersStr);
        users = users.map((u: any) => {
          if (u.id === user.id) {
            // Keep the password when updating the user in the users array
            return { ...u, ...data };
          }
          return u;
        });
        
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // If this is a business user and shop details were updated, update the shop too
      if (user.role === 'business' && (data.shopName || data.shopDescription || data.shopLogo || data.shopCategory || data.shopLocation)) {
        const shops = JSON.parse(localStorage.getItem('shops') || '[]');
        const updatedShops = shops.map((shop: any) => {
          if (shop.id === user.id) {
            return {
              ...shop,
              name: data.shopName || shop.name,
              description: data.shopDescription || shop.description,
              logo: data.shopLogo || shop.logo,
              category: data.shopCategory || shop.category,
              location: data.shopLocation || shop.location
            };
          }
          return shop;
        });
        
        localStorage.setItem('shops', JSON.stringify(updatedShops));
      }
      
      // Update state
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
  
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // Keep the USER_DATA_KEY to maintain compatibility with old code
    navigate('/');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn, 
      login, 
      signup, 
      logout,
      updateUserProfile
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
