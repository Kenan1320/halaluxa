
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Call onComplete with a delay for better user experience
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-[#1e3a5f] to-[#111d42] z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: [0.9, 1.05, 1],
          y: [0, -5, 0]
        }}
        transition={{ 
          duration: 1.8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="text-center"
      >
        <img 
          src="/lovable-uploads/256c0ffd-bafb-4348-94a6-074e92d4b6e3.png" 
          alt="Halvi Logo" 
          className="h-24 w-24 mx-auto mb-4" 
        />
        <p className="text-white/80 text-lg font-light tracking-wider">
          Your Halal Village
        </p>
      </motion.div>

      <motion.div 
        className="absolute bottom-16 w-20 h-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="w-full h-full border-4 border-t-transparent border-white/30 rounded-full animate-spin"></div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
