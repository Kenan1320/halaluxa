
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check, Mail, Lock, User, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import ShopSetupForm from '@/components/auth/ShopSetupForm';

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
  
  const [userType, setUserType] = useState<'shopper' | 'business'>('shopper');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Animation variants
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      // Sign up with Supabase
      const success = await signup(formData.email, formData.password, formData.name, userType);
      
      if (success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
        });
        
        // If business user, go to shop setup step
        if (userType === 'business') {
          setStep(2);
        } else {
          // If shopper, go directly to home page
          navigate('/shop');
        }
      } else {
        throw new Error("Sign up failed");
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
      // Store the selected user type in localStorage temporarily
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
      
      // The redirect will happen automatically
    } catch (error) {
      console.error('Error signing up with Google:', error);
      toast({
        title: "Error",
        description: "Failed to sign up with Google",
        variant: "destructive",
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
            onComplete={handleShopSetupComplete} 
            onSkip={handleSkipShopSetup}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-haluna-primary-light to-white flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Card className="border-0 shadow-none">
          <CardHeader>
            <motion.div variants={itemVariants}>
              <Link to="/" className="inline-flex items-center text-haluna-text-light hover:text-haluna-primary mb-4 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Link>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-serif text-center text-transparent bg-clip-text bg-gradient-to-r from-haluna-primary to-purple-600">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-center mt-2">
                Join Haluna to discover Muslim-owned businesses
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <motion.div variants={itemVariants}>
              <Tabs defaultValue="shopper" onValueChange={(v) => setUserType(v as 'shopper' | 'business')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="shopper">Shopper</TabsTrigger>
                  <TabsTrigger value="business">Business Owner</TabsTrigger>
                </TabsList>
                <TabsContent value="shopper">
                  <div className="flex items-center justify-center space-x-4 py-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                      <Store className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Shop for halal products</p>
                      <p className="text-sm text-muted-foreground">Browse and buy from Muslim-owned businesses</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="business">
                  <div className="flex items-center justify-center space-x-4 py-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                      <Store className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Sell your products</p>
                      <p className="text-sm text-muted-foreground">Create a shop and reach Muslim customers</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
            
            {/* Google Sign Up Button */}
            <motion.div variants={itemVariants}>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center h-12 border-gray-300" 
                onClick={handleGoogleSignUp}
              >
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or sign up with email</span>
              </div>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-haluna-text-light" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-haluna-text-light" />
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-haluna-text-light" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-haluna-text-light" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700 transition-all duration-300 h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Check size={18} className="mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <motion.div variants={itemVariants}>
              <p className="text-haluna-text-light text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-haluna-primary font-medium hover:underline transition-colors">
                  Log in
                </Link>
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <p className="text-xs text-center text-haluna-text-light">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
