
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Check, Mail, Lock, User } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthRoleSelector from '@/components/auth/AuthRoleSelector';
import ShopSetupForm from '@/components/auth/ShopSetupForm';

const SignUpPage = () => {
  const { register, googleSignIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [userType, setUserType] = useState<'shopper' | 'business'>('shopper');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUserTypeChange = (type: 'shopper' | 'business') => {
    setUserType(type);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const success = await register(
        formData.email,
        formData.password,
        formData.name,
        userType
      );
      
      if (success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
        });
        
        // If business user, go to shop setup step
        if (userType === 'business') {
          setStep(2);
        } else {
          // If shopper, go directly to shop page
          navigate('/shop');
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to create account",
          variant: "destructive"
        });
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
  
  const handleGoogleSignUp = async () => {
    try {
      await googleSignIn(userType);
      // Redirect is handled by the OAuth provider
    } catch (error) {
      console.error('Error signing up with Google:', error);
      toast({
        title: "Error",
        description: "Failed to sign up with Google",
        variant: "destructive"
      });
    }
  };
  
  const handleShopSetupComplete = () => {
    toast({
      title: "Shop created",
      description: "Your shop has been set up successfully. You can now add products.",
    });
    navigate('/dashboard');
  };
  
  const handleSkipShopSetup = () => {
    toast({
      title: "Shop setup skipped",
      description: "You can set up your shop later from the dashboard.",
    });
    navigate('/dashboard');
  };
  
  // Render shop setup form if on step 2
  if (step === 2) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <ShopSetupForm 
            onSetupComplete={handleShopSetupComplete} 
            onSkipSetup={handleSkipShopSetup}
          />
        </div>
      </div>
    );
  }
  
  // Animation variants for form elements
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <AuthLayout 
      title="Create Your Account" 
      subtitle="Join Haluna to discover Muslim-owned businesses"
    >
      <motion.div variants={itemVariants}>
        <AuthRoleSelector onSelect={handleUserTypeChange} selectedType={userType} />
      </motion.div>
      
      {/* Google Sign Up Button */}
      <motion.div variants={itemVariants} className="mb-6">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center h-12 border-gray-300" 
          onClick={handleGoogleSignUp}
          disabled={isLoading}
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={itemVariants}>
          <Label htmlFor="name" className="text-sm font-medium text-haluna-text mb-1">
            Full Name
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-haluna-text-light" />
            </div>
            <Input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Label htmlFor="email" className="text-sm font-medium text-haluna-text mb-1">
            Email Address
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-haluna-text-light" />
            </div>
            <Input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
              placeholder="name@example.com"
              disabled={isLoading}
            />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Label htmlFor="password" className="text-sm font-medium text-haluna-text mb-1">
            Password
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-haluna-text-light" />
            </div>
            <Input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-haluna-text mb-1">
            Confirm Password
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-haluna-text-light" />
            </div>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700 transition-all duration-300 h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <motion.span 
                  className="inline-block mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ◌
                </motion.span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </motion.div>
      </form>
      
      <motion.div className="mt-8 text-center" variants={itemVariants}>
        <p className="text-haluna-text-light">
          Already have an account?{' '}
          <Link to="/login" className="text-haluna-primary font-medium hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </motion.div>
      
      <motion.div 
        className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-haluna-text-light"
        variants={itemVariants}
      >
        By signing up, you agree to our Terms of Service and Privacy Policy
      </motion.div>
    </AuthLayout>
  );
};

export default SignUpPage;
