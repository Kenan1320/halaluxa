
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function GoogleAuthCallback() {
  const [status, setStatus] = useState('Processing authentication...');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const setupUser = async () => {
      try {
        // Get current user info
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error(userError?.message || 'Authentication failed');
        }
        
        // Check if user intended to sign up as a business
        const signupUserType = localStorage.getItem('signupUserType');
        const isBusiness = signupUserType === 'business';
        
        // Update profile with business status
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            is_business_owner: isBusiness,
            role: isBusiness ? 'business' : 'shopper'
          })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
        }
        
        // Clear stored signup type
        localStorage.removeItem('signupUserType');
        
        // Check if the user already has a shop
        if (isBusiness) {
          const { data: shop, error: shopError } = await supabase
            .from('shops')
            .select('id')
            .eq('owner_id', user.id)
            .maybeSingle();
            
          if (shopError) {
            console.error('Error checking shop:', shopError);
          }
          
          toast({
            title: 'Authentication successful',
            description: shop ? 'Welcome back to your business account' : 'Please complete your shop setup',
          });
          
          // Redirect based on whether they already have a shop
          navigate(shop ? '/dashboard' : '/business/create-shop');
        } else {
          toast({
            title: 'Authentication successful',
            description: 'You have successfully signed in',
          });
          
          // Redirect to home page for shoppers
          navigate('/');
        }
      } catch (error: any) {
        console.error('Error in Google callback:', error);
        setStatus(`Authentication failed: ${error.message}`);
        
        toast({
          title: 'Authentication failed',
          description: error.message || 'Failed to complete authentication',
          variant: 'destructive'
        });
        
        // Redirect to login page on error
        setTimeout(() => {
          navigate('/business/login');
        }, 3000);
      }
    };
    
    setupUser();
  }, [navigate, toast]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <img src="/logo.png" alt="Haluna" className="h-12 mx-auto mb-6" />
        <div className="animate-pulse mb-4">
          <div className="h-4 w-32 mx-auto bg-emerald-200 rounded"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication in Progress</h2>
        <p className="text-gray-600 mb-6">{status}</p>
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
