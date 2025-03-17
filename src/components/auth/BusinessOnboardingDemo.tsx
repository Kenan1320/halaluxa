
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Phone, ChevronLeft, ChevronRight, X, Check, Users, Globe, Search, ShoppingBag, DollarSign, BarChart, Smartphone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BusinessOnboardingDemoProps {
  onClose: () => void;
}

const BusinessOnboardingDemo = ({ onClose }: BusinessOnboardingDemoProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      title: "Share with Your Audience",
      description: "Connect with existing customers and reach new ones by sharing your store link.",
      icon: <Users className="h-8 w-8 text-green-500" />
    },
    {
      title: "Global Visibility",
      description: "Enjoy all visitors seeing your store from anywhere in the world.",
      icon: <Globe className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Smart Recommendations",
      description: "You'll be recommended to shoppers who search, bought or browsed the themes of your store locally & online.",
      icon: <Search className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Manage Products Easily",
      description: "Add, edit, and organize your products with our easy-to-use dashboard.",
      icon: <ShoppingBag className="h-8 w-8 text-orange-500" />
    },
    {
      title: "Secure Payments",
      description: "Accept payments securely from customers worldwide.",
      icon: <DollarSign className="h-8 w-8 text-teal-500" />
    },
    {
      title: "Analytics & Insights",
      description: "Track your store's performance with detailed analytics and reports.",
      icon: <BarChart className="h-8 w-8 text-indigo-500" />
    }
  ];
  
  const handleNext = () => {
    if (currentSlide < features.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };
  
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };
  
  // Auto scroll to center the current slide in the container
  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.scrollTo({
        left: currentSlide * 320,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      >
        <motion.div 
          className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600">
                Business Account Pending
              </h2>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-600">Your account is being reviewed</p>
                  <h3 className="text-lg font-semibold">24-72 Hours for Approval</h3>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your business profile will be reviewed within 24-72 hours. Once approved, you'll get full access to all seller features.
              </p>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">These features await you:</h3>
              
              <div className="relative">
                <div 
                  ref={slideRef}
                  className="flex overflow-x-auto pb-4 px-2 scroll-smooth hide-scrollbar"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex-none w-64 mr-4 scroll-snap-align-start ${index === currentSlide ? 'scale-100' : 'scale-95 opacity-70'}`}
                      style={{ 
                        scrollSnapAlign: 'start',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Card className={`h-full border-2 ${index === currentSlide ? 'border-blue-500 dark:border-blue-400' : 'border-gray-200 dark:border-gray-700'}`}>
                        <CardContent className="p-6">
                          <div className="flex justify-center mb-4">
                            {feature.icon}
                          </div>
                          <h4 className="text-lg font-semibold text-center mb-2">{feature.title}</h4>
                          <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
                
                {/* Controls */}
                <button
                  onClick={handlePrev}
                  disabled={currentSlide === 0}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md ${
                    currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={currentSlide === features.length - 1}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md ${
                    currentSlide === features.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              {/* Indicators */}
              <div className="flex justify-center mt-4 space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You'll receive an email once approved
              </p>
              <Button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Check className="mr-2 h-4 w-4" /> Got It
              </Button>
            </div>
          </div>
          
          {/* Phone frame */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <Phone className="absolute top-0 left-0 w-full h-full text-gray-200 dark:text-gray-800 opacity-10" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BusinessOnboardingDemo;
