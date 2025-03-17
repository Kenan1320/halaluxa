
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { createShop } from '@/services/shopService';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Store, MapPin, Tag, FileText, Upload, X } from 'lucide-react';
import ShopSetupForm from './ShopSetupForm';

const BusinessOnboarding = () => {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestUsername, setGuestUsername] = useState('');
  const [guestRole, setGuestRole] = useState<'business' | 'shopper' | 'admin'>('business');
  const [showGuestNameInput, setShowGuestNameInput] = useState(false);
  const [skipOnboarding, setSkipOnboarding] = useState(false);
  
  // Check if user is a returning guest
  useEffect(() => {
    const storedGuestStatus = sessionStorage.getItem('isGuestBusinessUser');
    const storedGuestUsername = sessionStorage.getItem('guestBusinessUsername');
    
    if (storedGuestStatus === 'true' && storedGuestUsername) {
      setIsGuest(true);
      setGuestUsername(storedGuestUsername);
    }
  }, []);
  
  // Check if user already has a shop
  useEffect(() => {
    if (user?.shop_name) {
      setOnboardingComplete(true);
    }
  }, [user]);
  
  // Auto-redirect to dashboard for logged-in business users
  useEffect(() => {
    if (isLoggedIn && user?.role === 'business') {
      // Always redirect to dashboard immediately
      navigate('/dashboard');
    }
  }, [isLoggedIn, user, navigate]);
  
  const handleOnboardingComplete = () => {
    toast({
      title: "Shop Created!",
      description: "Your shop has been created successfully.",
    });
    setOnboardingComplete(true);
    navigate('/dashboard');
  };
  
  const handleSkip = () => {
    toast({
      title: "Onboarding Skipped",
      description: "You can set up your shop later in Settings.",
    });
    setSkipOnboarding(true);
    navigate('/dashboard');
  };
  
  const handleGuestMode = (role: 'business' | 'shopper' | 'admin') => {
    setGuestRole(role);
    if (showGuestNameInput) {
      if (guestUsername.trim().length > 0) {
        // Save the guest username to session storage
        sessionStorage.setItem('guestBusinessUsername', guestUsername);
        sessionStorage.setItem('isGuestBusinessUser', 'true');
        sessionStorage.setItem('guestRole', role);
        
        toast({
          title: "Guest Mode Activated",
          description: `Welcome, ${guestUsername}! You're now viewing as a guest ${role}. Your username has been saved for this session.`,
        });
        setIsGuest(true);
        
        if (role === 'business') {
          navigate('/dashboard');
        } else if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: "Username Required",
          description: "Please enter a username to continue as a guest.",
          variant: "destructive"
        });
      }
    } else {
      setShowGuestNameInput(true);
    }
  };
  
  const handleDirectGuestAccess = (role: 'business' | 'shopper' | 'admin') => {
    // Generate a random guest username
    const randomId = Math.floor(Math.random() * 10000);
    const autoUsername = `Guest${randomId}`;
    
    sessionStorage.setItem('guestBusinessUsername', autoUsername);
    sessionStorage.setItem('isGuestBusinessUser', 'true');
    sessionStorage.setItem('guestRole', role);
    
    toast({
      title: "Guest Mode Activated",
      description: `Welcome, ${autoUsername}! You're now viewing as a guest ${role}.`,
    });
    setIsGuest(true);
    
    if (role === 'business') {
      navigate('/dashboard');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };
  
  if (!isLoggedIn && !isGuest) {
    return (
      <div className="container mx-auto max-w-md px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg bg-white dark:bg-gray-800 border dark:border-gray-700">
            <CardHeader className="dark:border-gray-700">
              <CardTitle className="text-2xl font-serif dark:text-white">Quick Access Portal</CardTitle>
              <CardDescription className="dark:text-gray-300">Access any part of the application as a guest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-white">
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded-lg p-4 dark:border-gray-700">
                  <h3 className="font-medium text-lg mb-2">Business Dashboard</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Access the seller dashboard to manage products, orders, and store settings.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDirectGuestAccess('business')} 
                      className="flex-1 bg-gradient-to-r from-[#0F1B44] to-[#183080] text-white"
                    >
                      Quick Access
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 dark:border-gray-700">
                  <h3 className="font-medium text-lg mb-2">Admin Portal</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Access the admin dashboard to manage all aspects of the application.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDirectGuestAccess('admin')} 
                      className="flex-1 bg-purple-600 text-white"
                    >
                      Quick Access
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 dark:border-gray-700">
                  <h3 className="font-medium text-lg mb-2">Shopper Experience</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Browse products, add to cart, and experience the buyer flow.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleDirectGuestAccess('shopper')} 
                      className="flex-1 bg-green-600 text-white"
                    >
                      Quick Access
                    </Button>
                  </div>
                </div>
              </div>
              
              {showGuestNameInput && (
                <div className="mt-4 space-y-3">
                  <Input
                    placeholder="Enter a username to remember"
                    value={guestUsername}
                    onChange={(e) => setGuestUsername(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowGuestNameInput(false)} 
                      variant="outline"
                      className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleGuestMode(guestRole)} 
                      className="flex-1 bg-gradient-to-r from-[#0F1B44] to-[#183080] text-white"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="text-center pt-2">
                <Link to="/auth/login" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Sign in to your account
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }
  
  // Business users automatically go to dashboard now
  return null;
};

export default BusinessOnboarding;
