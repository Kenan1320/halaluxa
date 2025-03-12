
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ShopSetupForm from './ShopSetupForm';

const BusinessOnboarding = () => {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  useEffect(() => {
    if (user?.shop_name) {
      setOnboardingComplete(true);
    }
  }, [user]);
  
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
