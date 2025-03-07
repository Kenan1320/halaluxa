
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [skipIntro, setSkipIntro] = useState(false);

  useEffect(() => {
    // Check if user has seen the intro before
    const hasSeenIntro = localStorage.getItem('halunaHasSeenIntro');
    
    if (hasSeenIntro === 'true') {
      setSkipIntro(true);
      // Still wait a brief moment for loading purposes
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // If first visit, show intro and save to localStorage
    const timer = setTimeout(() => {
      localStorage.setItem('halunaHasSeenIntro', 'true');
      setAnimationComplete(true);
    }, 5500); // Total animation time
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    localStorage.setItem('halunaHasSeenIntro', 'true');
    onComplete();
  };

  const handleContinue = () => {
    onComplete();
  };
  
  if (skipIntro) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-4xl font-bold text-haluna-primary"
        >
          <div className="flex items-center justify-center">
            <img src="/logo-base.svg" alt="Haluna" className="w-24 h-24" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <AnimatePresence>
        {!animationComplete ? (
          <motion.div 
            key="animation"
            className="flex flex-col items-center"
            exit={{ opacity: 0 }}
          >
            <div className="relative w-32 h-32">
              <motion.img 
                src="/logo-base.svg" 
                alt="Haluna Logo Base" 
                className="absolute"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              
              <motion.img 
                src="/logo-dots.svg" 
                alt="Haluna Logo Dots"
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1] }}
                transition={{ 
                  duration: 2, 
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  delay: 1
                }}
              />
              
              <motion.img 
                src="/logo-smile.svg" 
                alt="Haluna Logo Smile"
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
              />
            </div>
            
            <motion.h1 
              className="mt-8 text-4xl font-bold text-haluna-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3 }}
            >
              Haluna
            </motion.h1>
            
            <motion.p
              className="mt-2 text-haluna-text-light text-center max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3.5 }}
            >
              Your Marketplace for Halal Products
            </motion.p>
            
            <Button 
              onClick={handleSkip} 
              variant="link" 
              className="mt-8 text-haluna-text-light"
            >
              Skip Intro
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            key="welcome"
            className="flex flex-col items-center px-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mb-6">
              <img src="/logo-base.svg" alt="Haluna" className="w-full" />
            </div>
            
            <h1 className="text-3xl font-bold text-haluna-primary mb-2">
              Welcome to Haluna
            </h1>
            
            <p className="text-haluna-text-light max-w-md mb-8">
              Discover and shop from verified Muslim businesses offering halal products and services.
            </p>
            
            <div className="space-y-4 w-full max-w-xs">
              <Button onClick={handleContinue} className="w-full">
                Get Started
              </Button>
              
              <div className="flex gap-4">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashScreen;
