
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, ArrowLeft, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, user, isInitializing } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'shopper' | 'business'>('shopper');

  // Get the intended destination, if any
  const from = location.state?.from?.pathname || '/';
  
  // If already logged in, redirect to appropriate page
  useEffect(() => {
    if (!isInitializing && isLoggedIn && user) {
      console.log('User is already logged in, redirecting');
      if (user.role === 'business') {
        navigate('/dashboard');
      } else {
        navigate('/shop');
      }
    }
  }, [isLoggedIn, user, navigate, isInitializing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Attempt to login
      const loggedInUser = await login(formData.email, formData.password);
      
      if (loggedInUser) {
        console.log('Login successful:', loggedInUser);
        
        // Check if the role matches the selected type
        if ((loggedInUser.role === 'shopper' && userType === 'business') || 
            (loggedInUser.role === 'business' && userType === 'shopper')) {
          toast({
            title: "Account Type Mismatch",
            description: `The account for ${formData.email} is registered as a ${loggedInUser.role}, not as a ${userType}. Logging you in as ${loggedInUser.role}.`,
            variant: "default",
          });
        }
        
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        // Navigate to the appropriate destination based on role
        if (loggedInUser.role === 'business') {
          navigate('/dashboard');
        } else {
          navigate(from === '/' ? '/shop' : from);
        }
      } else {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Store the selected user type in localStorage temporarily
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
      
      // The redirect will happen automatically
      console.log('Google sign-in initiated:', data);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  // Show loading state while initializing auth
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haluna-primary"></div>
      </div>
    );
  }

  // If already logged in, no need to render the form
  if (isLoggedIn && user) {
    return null;
  }

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
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center mt-2">
                Log in to your Haluna account
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
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    Log in to browse and shop
                  </div>
                </TabsContent>
                <TabsContent value="business">
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    Log in to manage your business
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
            
            {/* Google Sign In Button */}
            <motion.div variants={itemVariants}>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center h-12 border-gray-300" 
                onClick={handleGoogleSignIn}
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
                <span className="px-2 bg-white text-gray-500">or log in with email</span>
              </div>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div variants={itemVariants}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-haluna-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
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
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700 transition-all duration-300 h-12" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      Log In as {userType === 'shopper' ? 'Shopper' : 'Business Owner'}
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <motion.div variants={itemVariants}>
              <p className="text-haluna-text-light text-center">
                Don't have an account?{' '}
                <Link to="/signup" className="text-haluna-primary font-medium hover:underline transition-colors">
                  Sign Up
                </Link>
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <p className="text-xs text-center text-haluna-text-light">
                By logging in, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
