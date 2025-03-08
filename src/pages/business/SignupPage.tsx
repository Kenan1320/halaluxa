
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Store, MapPin, FileText, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSignupFormData } from '@/models/shop';

// Shop categories
const SHOP_CATEGORIES = [
  "Food & Groceries",
  "Fashion",
  "Beauty & Wellness",
  "Home & Decor",
  "Books & Stationery",
  "Electronics",
  "Toys & Games",
  "Health & Fitness",
  "Other"
];

export default function BusinessSignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<BusinessSignupFormData>({
    email: '',
    password: '',
    name: '',
    shopName: '',
    shopDescription: '',
    shopCategory: '',
    shopLocation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            is_business_owner: true
          }
        }
      });

      if (authError) throw authError;
      
      if (authData.user) {
        // 2. Update profile to mark as business owner
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            is_business_owner: true,
            name: formData.name
          })
          .eq('id', authData.user.id);
        
        if (profileError) throw profileError;
        
        // 3. Create shop
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .insert({
            name: formData.shopName,
            description: formData.shopDescription,
            category: formData.shopCategory,
            location: formData.shopLocation,
            owner_id: authData.user.id
          })
          .select()
          .single();
        
        if (shopError) throw shopError;
        
        setSuccess('Business account created successfully! Please check your email to verify your account.');
        
        // Redirect after a delay
        setTimeout(() => {
          navigate('/business/login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google signup
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

  const goToNextStep = () => {
    // Validate first step
    if (currentStep === 1) {
      if (!formData.email || !formData.password || !formData.name) {
        setError('Please fill in all required fields');
        return;
      }
      setError('');
    }
    setCurrentStep(prev => prev + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
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
                Create your shop and start selling
              </p>
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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start"
              >
                <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-6">
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
                          placeholder="Choose a strong password"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-6">
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
                      <label htmlFor="shopCategory" className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Category
                      </label>
                      <Select
                        value={formData.shopCategory}
                        onValueChange={(value) => handleSelectChange('shopCategory', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {SHOP_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="shopLocation" className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Location
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
                          placeholder="City, State/Country"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Shop Description
                      </label>
                      <div className="relative">
                        <FileText className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                        <Textarea
                          id="shopDescription"
                          name="shopDescription"
                          required
                          value={formData.shopDescription}
                          onChange={handleChange}
                          className="pl-10 min-h-[100px]"
                          placeholder="Describe your shop and what makes it unique"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                )}
                
                {currentStep < 2 ? (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="ml-auto bg-emerald-600 hover:bg-emerald-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="ml-auto bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      'Create Business Account'
                    )}
                  </Button>
                )}
              </div>

              {currentStep === 1 && (
                <>
                  <div className="relative mt-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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
                </>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have a business account?{' '}
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
