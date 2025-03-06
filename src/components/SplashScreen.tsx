
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen = ({ onFinished }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for exit animation before calling onFinished
      setTimeout(onFinished, 800);
    }, 3000); // 3 seconds display time

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D5D56] via-[#2A866A] to-[#F97316] overflow-hidden">
            {/* Animated gradient overlay */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-[#0D5D56] via-[#2A866A] to-[#F97316]"
              animate={{ 
                y: [0, 10, 0],
                opacity: [1, 0.9, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>

          <div className="relative flex flex-col items-center justify-center w-full max-w-lg z-10">
            {/* Haluna Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                ease: "easeOut",
                delay: 0.2
              }}
              className="flex flex-col items-center"
            >
              <motion.h1 
                className="text-white text-[4rem] font-serif font-bold leading-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut",
                  delay: 0.4
                }}
              >
                Haluna
              </motion.h1>
              
              {/* Orange circle */}
              <motion.div
                className="mt-5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.85 }}
                transition={{ 
                  delay: 0.7, 
                  duration: 0.6,
                  ease: "easeOut"
                }}
              >
                <motion.div
                  className="w-12 h-12 bg-orange-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.85, 1, 0.85] 
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
