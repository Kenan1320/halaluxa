
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  // Check if user already has a shop
  useEffect(() => {
    if (user?.shopName) {
      setOnboardingComplete(true);
    }
  }, [user]);
  
  // If user completes onboarding or skips, redirect them
  useEffect(() => {
    if (onboardingComplete) {
      navigate('/dashboard');
    }
  }, [onboardingComplete, navigate]);
  
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
  
  if (!isLoggedIn || !user) {
    return null;
  }
  
  // Check if user is a business account
  if (user.role !== 'business') {
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
        </Card>
      </motion.div>
    </div>
  );
};

export default BusinessOnboarding;
