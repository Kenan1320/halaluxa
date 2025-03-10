
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
          className="fixed inset-0 flex flex-col items-center justify-center bg-[#E4F5F0] z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center">
            {/* Logo with building icon and Halvi text */}
            <motion.div 
              className="flex flex-col items-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img src="/logo-dots.svg" alt="Halvi Building Icon" className="w-12 h-12 mb-2" />
              <h1 className="text-5xl font-serif font-bold text-[#2A866A]">Halvi</h1>
            </motion.div>
            
            {/* Tagline with word-by-word animation */}
            <div className="h-8 flex items-center justify-center space-x-2 mt-2">
              {showTagline && (
                <>
                  <motion.span 
                    className="text-lg text-[#2A866A] opacity-0"
                    initial={{ opacity: 0 }}
                    animate={showWord1 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    The
                  </motion.span>
                  <motion.span 
                    className="text-lg text-[#2A866A] opacity-0"
                    initial={{ opacity: 0 }}
                    animate={showWord2 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    Halal
                  </motion.span>
                  <motion.span 
                    className="text-lg text-[#2A866A] opacity-0"
                    initial={{ opacity: 0 }}
                    animate={showWord3 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    Village
                  </motion.span>
                </>
              )}
            </div>
            
            {/* Loading dots animation */}
            <motion.div 
              className="flex space-x-2 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div 
                className="w-3 h-3 rounded-full bg-[#E4875E]"
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
                className="w-3 h-3 rounded-full bg-[#E4875E]"
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
                className="w-3 h-3 rounded-full bg-[#E4875E]"
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
