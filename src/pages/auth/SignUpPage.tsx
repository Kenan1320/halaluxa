
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Check, LogIn, ArrowLeft, Lock, Mail, User, Store, MapPin, Briefcase } from 'lucide-react';
import LoginSelector from './LoginSelector';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BusinessOnboardingDemo from '@/components/auth/BusinessOnboardingDemo';
import { createShop } from '@/services/shopService';

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
  
  const [businessData, setBusinessData] = useState({
    shopName: '',
    shopDescription: '',
    shopCategory: '',
    shopLocation: '',
  });
  
  const [userType, setUserType] = useState<'shopper' | 'business' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showOnboardingDemo, setShowOnboardingDemo] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setBusinessData(prev => ({ ...prev, [name]: value }));
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
    
    // If business user, move to step 2 to collect business details
    if (userType === 'business' && step === 1) {
      setStep(2);
      return;
    }
    
    // Validate business data if on step 2
    if (userType === 'business' && step === 2) {
      if (!businessData.shopName || !businessData.shopCategory || !businessData.shopLocation) {
        toast({
          title: "Required Fields Missing",
          description: "Please fill in all required business information",
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Sign up the user
      await signup(formData.email, formData.password, formData.name, userType);
      
      // If business user, create shop with pending status
      if (userType === 'business') {
        // In a real app, you would use the actual user ID from the signup response
        const userId = "temp-" + Date.now();
        
        await createShop({
          name: businessData.shopName,
          description: businessData.shopDescription,
          category: businessData.shopCategory,
          location: businessData.shopLocation,
          logo_url: '',
          owner_id: userId,
          status: 'pending',
          is_verified: false,
          rating: 0,
          product_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        // Show the onboarding demo to business users
        setShowOnboardingDemo(true);
      } else {
        navigate('/shop');
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
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
  
  const handleDemoClose = () => {
    setShowOnboardingDemo(false);
    navigate('/dashboard');
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
  
  // Shop categories
  const shopCategories = [
    "Food & Groceries",
    "Fashion",
    "Beauty & Wellness",
    "Home & Decor",
    "Books & Stationery",
    "Electronics",
    "Toys & Games",
    "Health & Fitness",
    "Other"
  ];
  
  // Show onboarding demo if needed
  if (showOnboardingDemo) {
    return <BusinessOnboardingDemo onClose={handleDemoClose} />;
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
          <h1 className="text-3xl font-serif font-bold text-haluna-text bg-clip-text text-transparent bg-gradient-to-r from-haluna-primary to-purple-600">
            {step === 1 ? 'Create Account' : 'Business Details'}
          </h1>
          <p className="text-haluna-text-light mt-2">
            {step === 1 
              ? 'Join Halvi to discover Muslim-owned businesses' 
              : 'Tell us about your business to complete your registration'}
          </p>
        </motion.div>
        
        {step === 1 && (
          <>
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
                    userType === 'business' ? (
                      <>
                        <Store size={18} className="mr-2" />
                        Continue to Business Details
                      </>
                    ) : (
                      <>
                        <LogIn size={18} className="mr-2" />
                        Sign Up as Shopper
                      </>
                    )
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
          </>
        )}
        
        {step === 2 && (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label htmlFor="shopName" className="block text-sm font-medium text-haluna-text mb-1">
                  Business Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={businessData.shopName}
                    onChange={handleBusinessChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                    placeholder="Your business name"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="shopCategory" className="block text-sm font-medium text-haluna-text mb-1">
                  Business Category *
                </label>
                <Select 
                  value={businessData.shopCategory} 
                  onValueChange={(value) => handleSelectChange('shopCategory', value)}
                >
                  <SelectTrigger className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-haluna-text-light" />
                    </div>
                    <SelectValue placeholder="Select business category" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="shopLocation" className="block text-sm font-medium text-haluna-text mb-1">
                  Business Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <input
                    type="text"
                    id="shopLocation"
                    name="shopLocation"
                    value={businessData.shopLocation}
                    onChange={handleBusinessChange}
                    className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                    placeholder="City, State"
                    required
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="shopDescription" className="block text-sm font-medium text-haluna-text mb-1">
                  Business Description *
                </label>
                <Textarea
                  id="shopDescription"
                  name="shopDescription"
                  value={businessData.shopDescription}
                  onChange={handleBusinessChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all min-h-24"
                  placeholder="Describe your business and what makes it unique"
                  required
                />
              </motion.div>
              
              <div className="flex gap-4 mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1" 
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back
                </Button>
                
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700 transition-all duration-300" 
                  disabled={isLoading}
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
                      <Store size={18} className="mr-2" />
                      Create Business Account
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                By submitting, your business will undergo a verification process (24-72 hours)
              </p>
            </form>
          </>
        )}
        
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

export default SignUpPage;
