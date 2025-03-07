
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowLeft, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import LoginSelector from './LoginSelector';
import { supabase } from '@/integrations/supabase/client';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'shopper' | 'business' | null>(null);
  const [rememberedEmail, setRememberedEmail] = useState<string | null>(null);

  // Get the intended destination, if any
  const from = location.state?.from?.pathname || '/';
  
  // Check for remembered login
  useEffect(() => {
    const savedEmail = localStorage.getItem('haluna_remembered_email');
    if (savedEmail) {
      setRememberedEmail(savedEmail);
      setFormData(prev => ({ ...prev, email: savedEmail }));
      
      // Check if this is a known business owner account
      const checkStoredRole = async () => {
        if (savedEmail) {
          try {
            const { data } = await supabase
              .from('profiles')
              .select('role')
              .eq('email', savedEmail)
              .maybeSingle();
              
            if (data?.role === 'business') {
              setUserType('business');
            }
          } catch (error) {
            console.error('Error checking stored role:', error);
          }
        }
      };
      
      checkStoredRole();
    }
  }, []);
  
  // If already logged in, redirect to appropriate page
  useEffect(() => {
    if (isLoggedIn) {
      const redirectPath = user?.role === 'business' ? '/dashboard' : '/shop';
      navigate(redirectPath);
    }
  }, [isLoggedIn, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    setLoading(true);
    
    try {
      // Attempt to check if the email exists in profiles and get the role
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', formData.email)
        .maybeSingle();
        
      // If the account exists, but the selected type doesn't match
      if (existingProfile && 
          ((existingProfile.role === 'business' && userType === 'shopper') || 
           (existingProfile.role === 'shopper' && userType === 'business'))) {
        toast({
          title: "Account Type Mismatch",
          description: `The account for ${formData.email} is registered as a ${existingProfile.role}, not as a ${userType}. Please select the correct account type.`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      // Attempt to login and get the user's actual role from the database
      const role = await login(formData.email, formData.password);
      
      if (role) {
        console.log('Login successful with role:', role);
        
        // Remember email if checkbox is checked
        const rememberMe = (document.getElementById('remember') as HTMLInputElement)?.checked;
        if (rememberMe) {
          localStorage.setItem('haluna_remembered_email', formData.email);
        } else {
          localStorage.removeItem('haluna_remembered_email');
        }
        
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        // Enable persistent login with localStorage
        localStorage.setItem('supabase.auth.token', 'true');
        
        // Navigate to the appropriate destination based on role
        if (role === 'business') {
          // For business owners, ensure they have a shop record
          const { data: shopData, error: shopError } = await supabase
            .from('shops')
            .select('id')
            .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
            .maybeSingle();
            
          if (!shopData && !shopError) {
            // If no shop exists, redirect to create shop flow
            navigate('/dashboard/settings');
            toast({
              title: "Complete Your Business Setup",
              description: "Please complete your business details to get started",
            });
          } else {
            navigate('/dashboard');
          }
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-serif font-bold text-haluna-text bg-clip-text text-transparent bg-gradient-to-r from-haluna-primary to-purple-600">Welcome Back</h1>
          <p className="text-haluna-text-light mt-2">Log in to your Haluna account</p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <LoginSelector onSelect={setUserType} selectedType={userType} />
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-haluna-text">
                Password
              </label>
              <a href="#" className="text-xs text-haluna-primary hover:underline transition-colors">
                Forgot password?
              </a>
            </div>
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
          
          <motion.div className="flex items-center" variants={itemVariants}>
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 text-haluna-primary border-haluna-text-light rounded focus:ring-haluna-primary focus:ring-1"
              defaultChecked={!!rememberedEmail}
            />
            <label htmlFor="remember" className="ml-2 text-sm text-haluna-text">
              Remember me
            </label>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700 transition-all duration-300 h-12" 
              disabled={loading || !userType}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Logging in...
                </div>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Log In as {userType === 'shopper' ? 'Shopper' : userType === 'business' ? 'Business Owner' : 'User'}
                </>
              )}
            </Button>
          </motion.div>
        </form>
        
        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <p className="text-haluna-text-light">
            Don't have an account?{' '}
            <Link to="/signup" className="text-haluna-primary font-medium hover:underline transition-colors">
              Sign Up
            </Link>
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-haluna-text-light"
          variants={itemVariants}
        >
          By logging in, you agree to our Terms of Service and Privacy Policy
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
