
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShopSetupForm from '@/components/auth/ShopSetupForm';
import { useAuth } from '@/context/AuthContext';
import { getCurrentUserShop } from '@/services/shopService';

const CreateShopPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkExistingShop = async () => {
      if (!isLoggedIn || !user) {
        navigate('/business/login');
        return;
      }
      
      try {
        const shop = await getCurrentUserShop();
        if (shop) {
          // User already has a shop, redirect to dashboard
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking for existing shop:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingShop();
  }, [isLoggedIn, user, navigate]);
  
  const handleShopCreated = () => {
    navigate('/dashboard');
  };
  
  const handleSkip = () => {
    // Redirect to dashboard even without a shop
    navigate('/dashboard');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create Your Shop</h1>
            <p className="mt-2 text-lg text-gray-600">
              Set up your business profile and start selling on Haluna
            </p>
          </div>
          
          <ShopSetupForm onComplete={handleShopCreated} onSkip={handleSkip} />
        </motion.div>
      </div>
    </div>
  );
};

export default CreateShopPage;
