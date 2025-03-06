
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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
    }
  ) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (data: ProfileUpdateData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for logged in user on mount
    const checkLoggedIn = () => {
      const isLoggedInStatus = localStorage.getItem('isLoggedIn');
      const storedUserJson = localStorage.getItem('user');
      
      if (isLoggedInStatus === 'true' && storedUserJson) {
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
    // Here you would typically call your authentication API
    // For now, we'll use localStorage as a simple demo
    
    const storedUserJson = localStorage.getItem('user');
    
    if (storedUserJson) {
      try {
        const storedUser = JSON.parse(storedUserJson);
        
        // In a real app, we would validate the password
        // Here we're just checking if the email matches
        if (storedUser.email === email) {
          setUser(storedUser);
          setIsLoggedIn(true);
          localStorage.setItem('isLoggedIn', 'true');
          return storedUser.role;
        }
      } catch (error) {
        console.error('Failed to parse stored user data', error);
      }
    }
    
    return false;
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
    }
  ): Promise<boolean> => {
    // Here you would typically call your registration API
    try {
      // Create a new user object
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
        ...(role === 'business' && shopDetails ? {
          shopName: shopDetails.shopName || '',
          shopDescription: shopDetails.shopDescription || '',
          shopCategory: shopDetails.shopCategory || '',
          shopLocation: shopDetails.shopLocation || '',
        } : {})
      };
      
      // Save to localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');
      
      // If it's a business user, create a shop entry
      if (role === 'business' && shopDetails?.shopName) {
        const newShop = {
          id: newUser.id, // Use the same ID as the user for simplicity
          name: shopDetails.shopName,
          description: shopDetails.shopDescription || 'New shop on Haluna',
          category: shopDetails.shopCategory || 'General',
          location: shopDetails.shopLocation || 'Online',
          coverImage: null,
          logo: null,
          isVerified: false,
          productCount: 0,
          rating: 5.0
        };
        
        // Save the new shop to shops in localStorage
        const existingShops = JSON.parse(localStorage.getItem('shops') || '[]');
        const updatedShops = [...existingShops, newShop];
        localStorage.setItem('shops', JSON.stringify(updatedShops));
      }
      
      setUser(newUser);
      setIsLoggedIn(true);
      
      return true;
    } catch (error) {
      console.error('Signup failed', error);
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
      
      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
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
      
      return true;
    } catch (error) {
      console.error('Profile update failed', error);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    navigate('/');
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
