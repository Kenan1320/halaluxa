
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Store, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSignupFormData } from '@/models/shop';
import { shopCategories } from '@/models/shop';

export default function BusinessSignupPage() {
  const [formData, setFormData] = useState<BusinessSignupFormData>({
    email: '',
    password: '',
    name: '',
    shopName: '',
    shopDescription: '',
    shopCategory: '',
    shopLocation: '',
  });
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate first step
      if (!formData.email || !formData.password || !formData.name) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    
    setError('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
    setError('');
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/business/google-auth-callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google signup error:', error);
      setError(error.message || 'Failed to sign up with Google');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate second step
    if (!formData.shopName || !formData.shopDescription || !formData.shopCategory || !formData.shopLocation) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            is_business_owner: true,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (signUpData.user) {
        // Update the profile to be a business owner
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            is_business_owner: true,
            full_name: formData.name,
          })
          .eq('id', signUpData.user.id);
        
        if (updateError) throw updateError;
        
        // Create the shop
        const { error: shopError } = await supabase
          .from('shops')
          .insert({
            name: formData.shopName,
            description: formData.shopDescription,
            category: formData.shopCategory,
            location: formData.shopLocation,
            owner_id: signUpData.user.id,
          });
        
        if (shopError) throw shopError;
        
        toast({
          title: "Registration successful",
          description: "Your business account has been created! Welcome to Haluna.",
        });
        
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <Link to="/">
                <img src="/logo.png" alt="Haluna" className="h-12 mx-auto mb-4" />
              </Link>
              <h2 className="text-3xl font-bold text-gray-900">Business Sign Up</h2>
              <p className="mt-2 text-gray-600">
                Join our community of Muslim-owned businesses
              </p>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="ml-2">
                    <p className={`text-sm font-medium ${step >= 1 ? 'text-emerald-600' : 'text-gray-500'}`}>Account</p>
                  </div>
                </div>
                
                <div className={`flex-1 mx-4 h-0.5 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                
                <div className="flex items-center">
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 2 ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="ml-2">
                    <p className={`text-sm font-medium ${step >= 2 ? 'text-emerald-600' : 'text-gray-500'}`}>Shop</p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"
              >
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}

            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Continue'
                  )}
                </Button>
                
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="w-full h-11 border-gray-300"
                  >
                    <img src="/google-logo.svg" alt="Google" className="h-5 w-5 mr-2" />
                    Sign up with Google
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Name
                  </label>
                  <div className="relative">
                    <Store className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      id="shopName"
                      name="shopName"
                      type="text"
                      required
                      value={formData.shopName}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Your shop name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Description
                  </label>
                  <textarea
                    id="shopDescription"
                    name="shopDescription"
                    rows={3}
                    required
                    value={formData.shopDescription}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:border-emerald-500 focus:ring-emerald-500"
                    placeholder="Describe your shop and products"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="shopCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="shopCategory"
                    name="shopCategory"
                    required
                    value={formData.shopCategory}
                    onChange={handleChange}
                    className="block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <option value="">Select a category</option>
                    {shopCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="shopLocation" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      id="shopLocation"
                      name="shopLocation"
                      type="text"
                      required
                      value={formData.shopLocation}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="City, State, Country"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isLoading}
                    onClick={handlePrevStep}
                    className="flex-1 h-11"
                  >
                    Back
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/business/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
