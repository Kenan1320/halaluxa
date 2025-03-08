
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the user info after OAuth redirect
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          throw new Error('No user found after authentication');
        }

        // Check if user is already a business owner or create as one
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_business_owner')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (!profileData.is_business_owner) {
          // Update profile to make this a business account
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_business_owner: true })
            .eq('id', user.id);

          if (updateError) throw updateError;
        }

        // Check if user has a shop
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (shopError && shopError.code !== 'PGRST116') { // PGRST116 is "no rows" error
          throw shopError;
        }

        if (shopData) {
          // User has a shop, redirect to dashboard
          toast({
            title: "Login successful",
            description: "Welcome back to your shop dashboard!",
          });
          navigate('/dashboard');
        } else {
          // No shop yet, redirect to create shop page
          toast({
            title: "Login successful",
            description: "Please complete your shop profile to continue.",
          });
          navigate('/business/create-shop');
        }
      } catch (error: any) {
        console.error('Google auth callback error:', error);
        setError(error.message || 'Authentication failed. Please try again.');
        toast({
          title: "Authentication Error",
          description: error.message || 'Failed to complete authentication.',
          variant: "destructive"
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/business/login');
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg text-center"
      >
        <img src="/logo.png" alt="Haluna" className="h-12 mx-auto mb-6" />
        
        {isProcessing ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Completing Authentication</h2>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">
              Please wait while we complete the authentication process...
            </p>
          </>
        ) : error ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600">Redirecting you back to login...</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Successful</h2>
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 text-emerald-600 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600">
              You're being redirected to your dashboard...
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
