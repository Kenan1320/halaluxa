
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [visible, setVisible] = useState(true);
  const [showTagline, setShowTagline] = useState(false);
  const [showWord1, setShowWord1] = useState(false);
  const [showWord2, setShowWord2] = useState(false);
  const [showWord3, setShowWord3] = useState(false);
  
  // Animation sequence timing
  useEffect(() => {
    const timer1 = setTimeout(() => setShowTagline(true), 800);
    const timer2 = setTimeout(() => setShowWord1(true), 1000);
    const timer3 = setTimeout(() => setShowWord2(true), 1700);
    const timer4 = setTimeout(() => setShowWord3(true), 2400);
    const timer5 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onFinish(), 300); // Call onFinish after animation completes
    }, 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onFinish]);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 flex flex-col items-center justify-center bg-[#E4F5F0] dark:bg-[#0d1b2a] z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center">
            {/* Logo with digital mall icon and Halvi text */}
            <motion.div 
              className="flex flex-col items-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-28 h-28 mb-3">
                <motion.div
                  className="absolute inset-0 bg-[#2A866A]/20 dark:bg-[#4ECBA5]/10 rounded-full"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }}
                />
                <img 
                  src="/logo-digital-mall.svg" 
                  alt="Halvi Digital Mall" 
                  className="w-20 h-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                />
              </div>
              <h1 className="text-6xl font-giaza font-bold text-[#2A866A] dark:text-[#4ECBA5] tracking-wide">
                Halvi
              </h1>
            </motion.div>
            
            {/* Tagline with word-by-word animation */}
            <div className="h-8 flex items-center justify-center space-x-2 mt-2">
              {showTagline && (
                <>
                  <motion.span 
                    className="text-lg text-[#2A866A] dark:text-[#4ECBA5] opacity-0 font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={showWord1 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    The
                  </motion.span>
                  <motion.span 
                    className="text-lg text-[#2A866A] dark:text-[#4ECBA5] opacity-0 font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={showWord2 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    Halal
                  </motion.span>
                  <motion.span 
                    className="text-lg text-[#2A866A] dark:text-[#4ECBA5] opacity-0 font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={showWord3 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    Mall
                  </motion.span>
                </>
              )}
            </div>
            
            {/* Loading dots animation */}
            <motion.div 
              className="flex space-x-3 mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-[#E4875E]"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 0
                }}
              />
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-[#E4875E]"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 0.2
                }}
              />
              <motion.div 
                className="w-2.5 h-2.5 rounded-full bg-[#E4875E]"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 0.4
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
