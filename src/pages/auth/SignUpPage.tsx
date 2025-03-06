
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowLeft, User, Mail, Lock, Store, ShoppingBag, MapPin, Tag, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'shopper' as 'shopper' | 'business',
    // Shop details for business users
    shopName: '',
    shopDescription: '',
    shopCategory: '',
    shopLocation: ''
  });
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (formData.role === 'business' && step === 1) {
      setStep(2);
    } else {
      handleSubmit();
    }
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const shopDetails = formData.role === 'business' ? {
        shopName: formData.shopName,
        shopDescription: formData.shopDescription,
        shopCategory: formData.shopCategory,
        shopLocation: formData.shopLocation
      } : undefined;
      
      const success = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        shopDetails
      );
      
      if (success) {
        toast({
          title: "Success",
          description: `Account created successfully${formData.role === 'business' ? '. Your shop is now live!' : ''}`,
        });
        
        navigate(formData.role === 'business' ? '/dashboard' : '/shop');
      } else {
        toast({
          title: "Error",
          description: "Failed to create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Categories for shop selection
  const shopCategories = [
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-haluna-primary-light to-white flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 md:p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Link to="/" className="inline-flex items-center text-haluna-text-light hover:text-haluna-primary mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
        
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-serif font-bold text-haluna-text bg-clip-text text-transparent bg-gradient-to-r from-haluna-primary to-purple-600">
            {step === 1 ? 'Join Haluna' : 'Set Up Your Shop'}
          </h1>
          <p className="text-haluna-text-light mt-2">
            {step === 1 ? 'Create your account today' : 'Tell us about your business'}
          </p>
        </motion.div>
        
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-5">
            <motion.div className="space-y-4 mb-6" variants={itemVariants}>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'shopper' 
                      ? 'border-haluna-primary bg-haluna-primary-light text-haluna-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'shopper' }))}
                >
                  <ShoppingBag size={24} className="mb-2" />
                  <span className="text-sm font-medium">I'm a Shopper</span>
                  <span className="text-xs text-haluna-text-light mt-1">Browse & buy products</span>
                </button>
                
                <button
                  type="button"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    formData.role === 'business' 
                      ? 'border-haluna-primary bg-haluna-primary-light text-haluna-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, role: 'business' }))}
                >
                  <Store size={24} className="mb-2" />
                  <span className="text-sm font-medium">I'm a Seller</span>
                  <span className="text-xs text-haluna-text-light mt-1">List & sell products</span>
                </button>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-medium text-haluna-text mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-haluna-text-light" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-haluna-text mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-haluna-text-light" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-haluna-text mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-haluna-text-light" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-haluna-text mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-haluna-text-light" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700 transition-all duration-300 h-12"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    {formData.role === 'business' ? (
                      <>
                        <Store size={18} className="mr-2" />
                        Next: Shop Details
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} className="mr-2" />
                        Sign Up
                      </>
                    )}
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="shopName" className="block text-sm font-medium text-haluna-text mb-1">
                Shop Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-haluna-text-light" />
                </div>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                  placeholder="Your Shop Name"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="shopCategory" className="block text-sm font-medium text-haluna-text mb-1">
                Category *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-haluna-text-light" />
                </div>
                <select
                  id="shopCategory"
                  name="shopCategory"
                  value={formData.shopCategory}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {shopCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="shopLocation" className="block text-sm font-medium text-haluna-text mb-1">
                Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-haluna-text-light" />
                </div>
                <input
                  type="text"
                  id="shopLocation"
                  name="shopLocation"
                  value={formData.shopLocation}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                  placeholder="City, State"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <label htmlFor="shopDescription" className="block text-sm font-medium text-haluna-text mb-1">
                Shop Description *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-haluna-text-light" />
                </div>
                <textarea
                  id="shopDescription"
                  name="shopDescription"
                  value={formData.shopDescription}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-haluna-primary focus:border-haluna-primary transition-all"
                  placeholder="Tell customers about your shop..."
                  rows={4}
                  required
                />
              </div>
              <p className="text-xs text-haluna-text-light mt-1">
                Briefly describe what your shop offers. You can add more details later.
              </p>
            </motion.div>
            
            <motion.div className="flex space-x-4" variants={itemVariants}>
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </Button>
              
              <Button 
                type="submit" 
                className="flex-1 flex items-center justify-center bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-haluna-primary hover:to-purple-700 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating Shop...
                  </div>
                ) : (
                  <>
                    <Store size={18} className="mr-2" />
                    Create Shop
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        )}
        
        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <p className="text-haluna-text-light">
            Already have an account?{' '}
            <Link to="/login" className="text-haluna-primary font-medium hover:underline transition-colors">
              Log In
            </Link>
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-haluna-text-light"
          variants={itemVariants}
        >
          By signing up, you agree to our Terms of Service and Privacy Policy
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
