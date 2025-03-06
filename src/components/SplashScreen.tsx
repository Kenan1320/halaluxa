
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
    }, 3500); // 3.5 seconds display time for better experience

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Premium Gradient Background with Animation */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A6B64] via-[#2A866A] to-[#F97316] overflow-hidden">
            {/* Animated gradient overlay for dynamic feel */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-[#1A6B64] via-[#2A866A] to-[#F97316]"
              animate={{ 
                y: [0, 20, 0],
                opacity: [1, 0.92, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
            
            {/* Additional subtle pattern overlay for premium feel */}
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
              <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTRtMC0xNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNG0wLTE0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00TTIyIDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00bTAtMTRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTRtMC0xNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNE04IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00bTAtMTRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTRtMC0xNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNCIvPjwvZz48L2c+PC9zdmc+')]"
               />
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center w-full max-w-lg z-10">
            {/* App Name with Elegant Typography */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.9, 
                ease: "easeOut",
                delay: 0.3
              }}
              className="flex flex-col items-center"
            >
              <motion.h1 
                className="text-white text-[4.5rem] font-serif font-bold leading-tight tracking-wide"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 1,
                  ease: "easeOut",
                  delay: 0.5
                }}
              >
                Haluna
              </motion.h1>
              
              {/* Subtitle for context - Muslim marketplace */}
              <motion.p
                className="text-white text-opacity-90 text-sm tracking-wider mt-1 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                Muslim Marketplace
              </motion.p>
              
              {/* Circular Emblem Symbol */}
              <motion.div
                className="mt-6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.85 }}
                transition={{ 
                  delay: 0.9, 
                  duration: 0.7,
                  ease: "easeOut"
                }}
              >
                <motion.div
                  className="w-14 h-14 bg-orange-400 rounded-full flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.08, 1],
                    opacity: [0.85, 0.92, 0.85] 
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Optional: Add a subtle inner design if desired */}
                  <div className="w-10 h-10 rounded-full border-2 border-white border-opacity-40"></div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
