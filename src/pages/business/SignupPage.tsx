
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Store, AlertCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BusinessSignupFormData } from '@/models/shop';

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                currentStep >= step
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
            {step < 2 && (
              <div
                className={`w-16 h-1 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BusinessSignupPage() {
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Partial<BusinessSignupFormData & { confirmPassword: string }>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateStep1 = () => {
    const newErrors: Partial<BusinessSignupFormData & { confirmPassword: string }> = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.name) newErrors.name = 'Your name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<BusinessSignupFormData> = {};
    
    if (!formData.shopName) newErrors.shopName = 'Shop name is required';
    if (!formData.shopCategory) newErrors.shopCategory = 'Please select a category';
    if (!formData.shopLocation) newErrors.shopLocation = 'Location is required';
    if (!formData.shopDescription) newErrors.shopDescription = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const goToNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      goToNextStep();
      return;
    }
    
    if (!validateStep2()) return;
    
    setIsLoading(true);
    
    try {
      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'business'
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.user) {
        // Update profile with business info
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            is_business_owner: true,
            shop_name: formData.shopName,
            shop_description: formData.shopDescription,
            shop_category: formData.shopCategory,
            shop_location: formData.shopLocation
          })
          .eq('id', data.user.id);
        
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
        
        // If email confirmation is required
        if (!data.session) {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your registration.",
          });
          navigate('/business/login');
        } else {
          // If user is automatically logged in
          toast({
            title: "Registration successful",
            description: "Let's set up your shop!",
          });
          navigate('/business/create-shop');
        }
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    
    try {
      // Store the intent to register as a business
      localStorage.setItem('signupUserType', 'business');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/business/google-auth-callback`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to sign up with Google",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Shop categories
  const shopCategories = [
    "Food & Groceries",
    "Clothing & Fashion",
    "Beauty & Personal Care",
    "Health & Wellness",
    "Home & Kitchen",
    "Books & Media",
    "Electronics",
    "Toys & Games",
    "Other"
  ];

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
              <h2 className="text-3xl font-bold text-gray-900">Business Registration</h2>
              <p className="mt-2 text-gray-600">
                {currentStep === 1 
                  ? "Create your business account" 
                  : "Tell us about your business"}
              </p>
            </div>

            <StepIndicator currentStep={currentStep} />

            <form onSubmit={handleSignup} className="space-y-6">
              {currentStep === 1 ? (
                // Step 1: Account Information
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
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
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
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
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                          }
                        }}
                        className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="relative mt-8">
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
                </div>
              ) : (
                // Step 2: Business Information
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
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.shopName ? 'border-red-500' : ''}`}
                        placeholder="Your Shop Name"
                      />
                    </div>
                    {errors.shopName && (
                      <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="shopCategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Shop Category
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Store className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="shopCategory"
                        name="shopCategory"
                        required
                        value={formData.shopCategory}
                        onChange={handleInputChange}
                        className={`pl-10 w-full h-10 border border-input bg-background rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.shopCategory ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select a category</option>
                        {shopCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    {errors.shopCategory && (
                      <p className="mt-1 text-sm text-red-600">{errors.shopCategory}</p>
                    )}
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
                        onChange={handleInputChange}
                        className={`pl-10 ${errors.shopLocation ? 'border-red-500' : ''}`}
                        placeholder="City, State"
                      />
                    </div>
                    {errors.shopLocation && (
                      <p className="mt-1 text-sm text-red-600">{errors.shopLocation}</p>
                    )}
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
                      onChange={handleInputChange}
                      className={`w-full border border-input rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.shopDescription ? 'border-red-500' : ''}`}
                      placeholder="Describe your shop and what makes it special"
                    />
                    {errors.shopDescription && (
                      <p className="mt-1 text-sm text-red-600">{errors.shopDescription}</p>
                    )}
                  </div>
                </div>
              )}

              <div className={`flex ${currentStep === 1 ? 'justify-end' : 'justify-between'} pt-6`}>
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
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Processing...</span>
                    </div>
                  ) : currentStep < 2 ? (
                    'Next'
                  ) : (
                    'Complete Registration'
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/business/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
