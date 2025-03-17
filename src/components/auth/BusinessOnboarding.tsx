
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
  const [showGuestNameInput, setShowGuestNameInput] = useState(false);
  
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
  
  // If user completes onboarding or skips, redirect them
  useEffect(() => {
    if (onboardingComplete || isGuest) {
      navigate('/dashboard');
    }
  }, [onboardingComplete, isGuest, navigate]);
  
  const handleOnboardingComplete = () => {
    toast({
      title: "Shop Created!",
      description: "Your shop has been created successfully.",
    });
    setOnboardingComplete(true);
  };
  
  const handleSkip = () => {
    toast({
      title: "Onboarding Skipped",
      description: "You can set up your shop later in Settings.",
    });
    setOnboardingComplete(true);
  };
  
  const handleGuestMode = () => {
    if (showGuestNameInput) {
      if (guestUsername.trim().length > 0) {
        // Save the guest username to session storage
        sessionStorage.setItem('guestBusinessUsername', guestUsername);
        sessionStorage.setItem('isGuestBusinessUser', 'true');
        
        toast({
          title: "Guest Mode Activated",
          description: `Welcome, ${guestUsername}! You're now viewing the dashboard as a guest. Your username has been saved for this session.`,
        });
        setIsGuest(true);
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
  
  const handleDirectGuestAccess = () => {
    // Generate a random guest username
    const randomId = Math.floor(Math.random() * 10000);
    const autoUsername = `Guest${randomId}`;
    
    sessionStorage.setItem('guestBusinessUsername', autoUsername);
    sessionStorage.setItem('isGuestBusinessUser', 'true');
    
    toast({
      title: "Guest Mode Activated",
      description: `Welcome, ${autoUsername}! You're now viewing the dashboard as a guest. Remember your username: ${autoUsername} to manage your content.`,
    });
    setIsGuest(true);
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
              <CardTitle className="text-2xl font-serif dark:text-white">Business Dashboard</CardTitle>
              <CardDescription className="dark:text-gray-300">You need to log in to access your business dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 dark:text-white">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Want to see how the dashboard works without signing up?
              </p>
              
              {!showGuestNameInput ? (
                <div className="space-y-3">
                  <Button 
                    onClick={handleGuestMode} 
                    className="w-full bg-gradient-to-r from-[#0F1B44] to-[#183080] text-white dark:bg-gradient-to-r dark:from-indigo-800 dark:to-indigo-900"
                  >
                    Enter as Guest with Username
                  </Button>
                  <Button 
                    onClick={handleDirectGuestAccess} 
                    variant="outline"
                    className="w-full border-[#0F1B44] text-[#0F1B44] hover:bg-[#0F1B44]/5 dark:border-indigo-500 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
                  >
                    Quick Access (No Username)
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
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
                      onClick={handleGuestMode} 
                      className="flex-1 bg-gradient-to-r from-[#0F1B44] to-[#183080] text-white dark:bg-gradient-to-r dark:from-indigo-800 dark:to-indigo-900"
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
  
  if (!user && !isGuest) {
    return null;
  }
  
  // Check if user is a business account
  if (user?.role !== 'business' && !isGuest) {
    return null;
  }
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="dark:border-b dark:border-gray-700">
            <CardTitle className="text-2xl font-serif dark:text-white">Welcome to Haluna!</CardTitle>
            <CardDescription className="dark:text-gray-300">Let's set up your shop to get started selling your products.</CardDescription>
          </CardHeader>
          <CardContent>
            <ShopSetupForm onComplete={handleOnboardingComplete} onSkip={handleSkip} />
          </CardContent>
          {isGuest && (
            <CardFooter className="bg-amber-50 dark:bg-amber-900/20 rounded-b-lg border-t border-amber-200 dark:border-amber-800">
              <div className="text-xs text-amber-700 dark:text-amber-400">
                <strong>Guest Mode:</strong> You're currently in guest mode as {sessionStorage.getItem('guestBusinessUsername')}. Changes won't be permanently saved.
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default BusinessOnboarding;
