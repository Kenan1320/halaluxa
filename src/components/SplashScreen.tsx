
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShoppingCart } from 'lucide-react';

export interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(1); // 1: Logo spinning, 2: Transforming to pin, 3: Complete
  const backgroundColor = '#FFFFFF';
  const textColor = '#2A866A';

  useEffect(() => {
    // Logo spinning phase (1.5 seconds)
    const timer1 = setTimeout(() => {
      setStage(2); // Transform to pin + cart
    }, 1500);

    // Transform phase (1 second)
    const timer2 = setTimeout(() => {
      setStage(3); // Complete animation
    }, 2500);

    // Final phase (0.5 seconds more for exit animation)
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <AnimatePresence>
        {stage === 1 && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ rotate: 360 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              rotate: { duration: 1.5, ease: "easeInOut", repeat: 0 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 relative">
              <motion.img 
                src="/logo-full-white.svg" 
                alt="Halvi" 
                className="w-full h-full"
                style={{ filter: `brightness(1) invert(0)` }}
              />
            </div>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -20, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="text-[#2A866A] transform"
            >
              <MapPin size={48} strokeWidth={2} />
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="absolute bottom-2 right-0 text-[#FF7A45]"
            >
              <ShoppingCart size={24} strokeWidth={2} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Halvi text is always visible but fades out at the end */}
      <motion.h1
        className="text-4xl font-serif font-bold mt-4"
        style={{ color: textColor }}
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: stage === 3 ? 0 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        Halvi
      </motion.h1>
      
      <motion.p
        className="text-sm mt-2 text-gray-600"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: stage === 3 ? 0 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        Your Halal Village
      </motion.p>
    </div>
  );
};

export default SplashScreen;
