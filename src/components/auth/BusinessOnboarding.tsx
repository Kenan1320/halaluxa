
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
    toast({
      title: "Guest Mode Activated",
      description: "You're now viewing the dashboard as a guest. Any changes won't be saved permanently.",
    });
    setIsGuest(true);
    // Store guest status in sessionStorage
    sessionStorage.setItem('isGuestBusinessUser', 'true');
  };
  
  if (!isLoggedIn && !isGuest) {
    return (
      <div className="container mx-auto max-w-md px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Business Dashboard</CardTitle>
              <CardDescription>You need to log in to access your business dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Want to see how the dashboard works without signing up?
              </p>
              <Button 
                onClick={handleGuestMode} 
                className="w-full bg-gradient-to-r from-[#0F1B44] to-[#183080] text-white"
              >
                Enter as Guest
              </Button>
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
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-serif">Welcome to Haluna!</CardTitle>
            <CardDescription>Let's set up your shop to get started selling your products.</CardDescription>
          </CardHeader>
          <CardContent>
            <ShopSetupForm onComplete={handleOnboardingComplete} onSkip={handleSkip} />
          </CardContent>
          {isGuest && (
            <CardFooter className="bg-amber-50 dark:bg-amber-900/20 rounded-b-lg border-t border-amber-200 dark:border-amber-800">
              <div className="text-xs text-amber-700 dark:text-amber-400">
                <strong>Guest Mode:</strong> You're currently in guest mode. Changes won't be permanently saved.
              </div>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default BusinessOnboarding;
