import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUserShop } from '@/services/shopService';
import ShopSetupForm from '@/components/auth/ShopSetupForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CreateShopPage = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const checkForExistingShop = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Pass user ID to getCurrentUserShop
          const shop = await getCurrentUserShop(user.id);
          if (shop) {
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error checking for existing shop:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkForExistingShop();
  }, [user, navigate, isLoggedIn]);

  const handleSetupComplete = () => {
    toast({
      title: 'Shop Created',
      description: 'Your shop has been created successfully!',
    });
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Create Your Shop</h1>
          <p className="text-gray-600">
            Set up your shop to start selling your products to the Haluna community.
          </p>
        </div>

        <ShopSetupForm onSetupComplete={handleSetupComplete} />

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => navigate('/')}>
            I'll do this later
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateShopPage;
