
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShoppingCart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    // Sequence of animations
    const timer1 = setTimeout(() => setAnimationStage(1), 1000); // Start spinning
    const timer2 = setTimeout(() => setAnimationStage(2), 2000); // Transform to pin
    const timer3 = setTimeout(() => setAnimationStage(3), 3000); // Add cart
    const timer4 = setTimeout(() => onComplete(), 4000); // Complete
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
      >
        <div className="relative">
          {/* Logo and text */}
          <motion.div
            className="flex flex-col items-center"
            animate={{
              rotate: animationStage >= 1 ? [0, 360] : 0,
              scale: animationStage >= 2 ? [1, 0] : 1
            }}
            transition={{
              rotate: { duration: 1, ease: "easeInOut" },
              scale: { delay: 1, duration: 0.5 }
            }}
          >
            <motion.div 
              className="text-4xl font-bold text-[#2A866A]"
              animate={{
                y: animationStage === 0 ? [0, -10, 0] : 0
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Halvi
            </motion.div>
          </motion.div>
          
          {/* Map Pin transformation */}
          <AnimatePresence>
            {animationStage >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
              >
                <motion.div className="text-[#2A866A]">
                  <MapPin size={60} strokeWidth={2} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Shopping cart addition */}
          <AnimatePresence>
            {animationStage >= 3 && (
              <motion.div
                initial={{ scale: 0, x: 50, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
              >
                <motion.div 
                  className="text-[#FF7A45]"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  <ShoppingCart size={30} strokeWidth={2} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-gray-500"
        >
          Shop Muslim Businesses
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
