
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the role from localStorage if it was set during sign-in
        const role = localStorage.getItem('signup_role') || 'shopper';
        
        // Check if we have a session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no session, try to exchange the auth code for a session
          const { data, error } = await supabase.auth.getUser();
          
          if (error) {
            throw error;
          }
          
          if (!data.user) {
            throw new Error('No user found');
          }
          
          // Update the user's metadata to include the role
          await supabase.auth.updateUser({
            data: { role }
          });
        }
        
        // Refresh the session to get the latest user data
        await refreshSession();
        
        // Clear the role from localStorage
        localStorage.removeItem('signup_role');
        
        // Show success message
        toast({
          title: 'Success',
          description: 'You have successfully signed in',
        });
        
        // Redirect to the appropriate page based on role
        if (role === 'business') {
          navigate('/dashboard');
        } else {
          navigate('/shop');
        }
      } catch (err: any) {
        console.error('Error during auth callback:', err);
        setError(err.message || 'An error occurred during authentication.');
        
        toast({
          title: 'Authentication Error',
          description: err.message || 'An error occurred during authentication.',
          variant: 'destructive',
        });
        
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };
    
    handleAuthCallback();
  }, [navigate, refreshSession, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-haluna-primary-light to-white p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <p className="text-gray-500">Redirecting you to the login page...</p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-haluna-primary"></div>
            </div>
            <h1 className="text-2xl font-bold text-haluna-text mb-4">Completing Authentication</h1>
            <p className="text-gray-700">Please wait while we finish setting up your account...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
