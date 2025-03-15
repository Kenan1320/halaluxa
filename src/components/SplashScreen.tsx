
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
    <div className="fixed inset-0 flex flex-col items-center justify-center deep-night-blue-gradient z-50">
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
        <h1 className="text-white text-6xl font-serif tracking-wide mb-2" 
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
          Halvi
        </h1>
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
