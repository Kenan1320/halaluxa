
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
    }, 2500); // 2.5 seconds display time

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#f9f5eb] to-[#f7f3e8] dark:from-[#0a2f20] dark:to-[#061c13]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[url('/patterns/geometric-light.svg')] dark:opacity-10 dark:bg-[url('/patterns/geometric-dark.svg')]"></div>
          
          {/* Logo container with animation */}
          <motion.div 
            className="relative z-10 mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              {/* Logo base */}
              <img 
                src="/logo-base.svg" 
                alt="Haluna Logo" 
                className="w-full h-full"
              />
              
              {/* Animated dots */}
              <motion.img 
                src="/logo-dots.svg"
                alt=""
                className="absolute top-0 left-0 w-full h-full"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
          
          {/* Tagline */}
          <motion.p 
            className="mb-8 font-serif text-lg md:text-xl font-medium text-haluna-primary-dark dark:text-haluna-primary-light"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Connecting You to Muslim Businesses & Shops you Love
          </motion.p>
          
          {/* Loading indicator */}
          <motion.div 
            className="w-2 h-2 rounded-full bg-haluna-primary"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
