
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Check, LogIn, ArrowLeft, Lock, Mail, User } from 'lucide-react';
import LoginSelector from './LoginSelector';
import { supabase } from '@/integrations/supabase/client';

const SignUpPage = () => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [userType, setUserType] = useState<'shopper' | 'business' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUserTypeChange = (type: 'shopper' | 'business') => {
    setUserType(type);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) {
      toast({
        title: "Select Account Type",
        description: "Please select whether you are a shopper or business owner",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signup(formData.email, formData.password, formData.name, userType);
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      
      if (userType === 'business') {
        setStep(2);
      } else {
        navigate('/shop');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (!userType) {
      toast({
        title: "Select Account Type",
        description: "Please select whether you are a shopper or business owner",
        variant: "destructive",
      });
      return;
    }
    
    try {
      localStorage.setItem('signupUserType', userType);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
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
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
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

  if (step === 2) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <ShopSetupForm 
            onComplete={() => navigate('/dashboard')} 
            onSkip={() => navigate('/dashboard')}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-night-blue to-white flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 md:p-8 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Link to="/" className="inline-flex items-center text-haluna-text-light hover:text-haluna-primary mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
        
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-serif font-bold text-haluna-text bg-clip-text text-transparent bg-gradient-to-r from-haluna-primary to-purple-600">Create Account</h1>
          <p className="text-haluna-text-light mt-2">Join Halvi to discover Muslim-owned businesses</p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <LoginSelector onSelect={handleUserTypeChange} selectedType={userType} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="mb-6">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center h-12 border-gray-300" 
            onClick={handleGoogleSignIn}
            disabled={!userType}
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or sign up with email</span>
          </div>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-medium text-haluna-text mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-haluna-text-light" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                placeholder="Your full name"
                required
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-haluna-text mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-haluna-text-light" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-haluna-text mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-haluna-text-light" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-haluna-text mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-haluna-text-light" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700 transition-all duration-300 h-12" 
              disabled={isLoading || !userType}
            >
              {isLoading ? (
                <>
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating Account...
                  </div>
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign Up as {userType === 'shopper' ? 'Shopper' : userType === 'business' ? 'Business Owner' : 'User'}
                </>
              )}
            </Button>
          </motion.div>
        </form>
        
        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <p className="text-haluna-text-light">
            Already have an account?{' '}
            <Link to="/login" className="text-haluna-primary font-medium hover:underline transition-colors">
              Log In
            </Link>
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-haluna-text-light"
          variants={itemVariants}
        >
          By signing up, you agree to our Terms of Service and Privacy Policy
        </motion.div>
      </motion.div>
    </div>
  );
};

// Importing at the bottom to avoid circular dependencies
import ShopSetupForm from '@/components/auth/ShopSetupForm';

export default SignUpPage;
