
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type UserRole = 'shopper' | 'business';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
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
  
  const login = async (email: string, password: string): Promise<boolean> => {
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
          return true;
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
    role: UserRole
  ): Promise<boolean> => {
    // Here you would typically call your registration API
    try {
      // Create a new user object
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role
      };
      
      // Save to localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isLoggedIn', 'true');
      
      setUser(newUser);
      setIsLoggedIn(true);
      
      return true;
    } catch (error) {
      console.error('Signup failed', error);
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
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
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
