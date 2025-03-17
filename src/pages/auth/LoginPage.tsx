
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowLeft, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import LoginSelector from './LoginSelector';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/context/ThemeContext';
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, user } = useAuth();
  const { toast: hookToast } = useToast();
  const { mode } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'shopper' | 'business' | null>(null);

  const from = location.state?.from?.pathname || '/';
  
  useEffect(() => {
    if (isLoggedIn) {
      if (user?.role === 'business') {
        navigate('/dashboard');
      } else {
        navigate('/shop');
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) {
      toast.error("Select Account Type", {
        description: "Please select whether you are a shopper or business owner",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      await login(formData.email);
    } catch (error) {
      toast.error("Login Failed", {
        description: "Failed to log in. Please check your credentials."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!userType) {
      toast.error("Select Account Type", {
        description: "Please select whether you are a shopper or business owner"
      });
      return;
    }
    
    try {
      localStorage.setItem('signupUserType', userType);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error("Google Sign In Failed", {
        description: "Failed to sign in with Google"
      });
    }
  };
  
  // Guest mode handler
  const handleGuestAccess = (role: 'business' | 'shopper' | 'admin') => {
    // Generate a random guest username
    const randomId = Math.floor(Math.random() * 10000);
    const autoUsername = `Guest${randomId}`;
    
    sessionStorage.setItem('guestBusinessUsername', autoUsername);
    sessionStorage.setItem('isGuestBusinessUser', 'true');
    sessionStorage.setItem('guestRole', role);
    
    toast.success(`Guest mode activated as ${autoUsername}!`, {
      description: `You're now viewing as a guest ${role}.`,
    });
    
    if (role === 'business') {
      navigate('/dashboard');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      mode === 'dark' 
        ? 'bg-gradient-to-b from-[#0F1B44] to-gray-900' 
        : 'bg-gradient-to-b from-deep-night-blue to-white'
    }`}>
      <motion.div 
        className={`max-w-md w-full rounded-2xl shadow-lg p-6 md:p-8 overflow-hidden ${
          mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
        }`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Link to="/" className={`inline-flex items-center hover:text-haluna-primary mb-6 transition-colors ${
            mode === 'dark' ? 'text-gray-300' : 'text-haluna-text-light'
          }`}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
        
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className={`text-3xl font-serif font-bold ${
            mode === 'dark'
              ? 'bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'
              : 'bg-clip-text text-transparent bg-gradient-to-r from-haluna-primary to-purple-600'
          }`}>Welcome Back</h1>
          <p className={mode === 'dark' ? 'text-gray-300 mt-2' : 'text-haluna-text-light mt-2'}>
            Log in to your Haluna account
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <LoginSelector onSelect={setUserType} selectedType={userType} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-6">
          <Button 
            type="button" 
            variant="outline" 
            className={`w-full flex items-center justify-center h-12 ${
              mode === 'dark' 
                ? 'border-gray-600 text-white' 
                : 'border-gray-300'
            }`}
            onClick={handleGoogleSignIn}
            disabled={!userType}
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${
              mode === 'dark' 
                ? 'bg-gray-800 text-gray-400' 
                : 'bg-white text-gray-500'
            }`}>or log in with email</span>
          </div>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
              mode === 'dark' ? 'text-gray-200' : 'text-haluna-text'
            }`}>
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-haluna-text-light'
                }`} />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full rounded-lg p-3 ${
                  mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                    : 'border border-gray-300 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary'
                } transition-all`}
                placeholder="you@example.com"
                required
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className={`block text-sm font-medium ${
                mode === 'dark' ? 'text-gray-200' : 'text-haluna-text'
              }`}>
                Password
              </label>
              <a href="#" className={`text-xs hover:underline transition-colors ${
                mode === 'dark' ? 'text-blue-400' : 'text-haluna-primary'
              }`}>
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`h-5 w-5 ${
                  mode === 'dark' ? 'text-gray-400' : 'text-haluna-text-light'
                }`} />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full rounded-lg p-3 ${
                  mode === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                    : 'border border-gray-300 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary'
                } transition-all`}
                placeholder="••••••••"
                required
              />
            </div>
          </motion.div>
          
          <motion.div className="flex items-center" variants={itemVariants}>
            <input
              id="remember"
              type="checkbox"
              className={`w-4 h-4 rounded focus:ring-1 ${
                mode === 'dark' 
                  ? 'text-blue-500 border-gray-600 focus:ring-blue-500' 
                  : 'text-haluna-primary border-haluna-text-light focus:ring-haluna-primary'
              }`}
            />
            <label htmlFor="remember" className={`ml-2 text-sm ${
              mode === 'dark' ? 'text-gray-300' : 'text-haluna-text'
            }`}>
              Remember me
            </label>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              type="submit" 
              className={`w-full flex items-center justify-center transition-all duration-300 h-12 ${
                mode === 'dark'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700'
              }`}
              disabled={loading || !userType}
            >
              {loading ? (
                <>
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Logging in...
                  </div>
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Log In as {userType === 'shopper' ? 'Shopper' : userType === 'business' ? 'Business Owner' : 'User'}
                </>
              )}
            </Button>
          </motion.div>
        </form>
        
        {/* Quick guest access options */}
        <motion.div variants={itemVariants} className="mt-6">
          <div className={`relative my-6 ${mode === 'dark' ? 'text-gray-300' : ''}`}>
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-2 ${
                mode === 'dark' 
                  ? 'bg-gray-800 text-gray-400' 
                  : 'bg-white text-gray-500'
              }`}>guest access options</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => handleGuestAccess('shopper')} 
              variant="outline" 
              className={`text-xs ${mode === 'dark' ? 'border-gray-700 text-gray-300' : ''}`}
            >
              Guest Shopper
            </Button>
            <Button 
              onClick={() => handleGuestAccess('business')} 
              variant="outline" 
              className={`text-xs ${mode === 'dark' ? 'border-gray-700 text-gray-300' : ''}`}
            >
              Guest Business
            </Button>
            <Button 
              onClick={() => handleGuestAccess('admin')} 
              variant="outline" 
              className={`text-xs ${mode === 'dark' ? 'border-gray-700 text-gray-300' : ''}`}
            >
              Guest Admin
            </Button>
          </div>
        </motion.div>
        
        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <p className={mode === 'dark' ? 'text-gray-400' : 'text-haluna-text-light'}>
            Don't have an account?{' '}
            <Link to="/signup" className={`font-medium hover:underline transition-colors ${
              mode === 'dark' ? 'text-blue-400' : 'text-haluna-primary'
            }`}>
              Sign Up
            </Link>
          </p>
        </motion.div>
        
        <motion.div 
          className={`mt-8 pt-6 border-t text-center text-xs ${
            mode === 'dark' 
              ? 'border-gray-700 text-gray-400'
              : 'border-gray-100 text-haluna-text-light'
          }`}
          variants={itemVariants}
        >
          By logging in, you agree to our Terms of Service and Privacy Policy
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
