
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [visible, setVisible] = useState(true);
  const [showTagline, setShowTagline] = useState(false);
  const [showWord1, setShowWord1] = useState(false);
  const [showWord2, setShowWord2] = useState(false);
  const [showWord3, setShowWord3] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  
  // Animation sequence timing
  useEffect(() => {
    const timer1 = setTimeout(() => setShowTagline(true), 800);
    const timer2 = setTimeout(() => setShowWord1(true), 1000);
    const timer3 = setTimeout(() => setShowWord2(true), 1700);
    const timer4 = setTimeout(() => setShowWord3(true), 2400);
    const timer5 = setTimeout(() => setDoorOpen(true), 3000);
    const timer6 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onFinish(), 300); // Call onFinish after animation completes
    }, 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
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
                    Village
                  </motion.span>
                </>
              )}
            </div>
            
            {/* Door Animation */}
            <motion.div 
              className="mt-12 w-24 h-32 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {/* Door frame */}
              <div className="absolute inset-0 bg-[#2A866A]/20 dark:bg-[#4ECBA5]/20 rounded-t-lg border-2 border-[#2A866A]/30 dark:border-[#4ECBA5]/30"></div>
              
              {/* Left door */}
              <motion.div 
                className="absolute top-0 left-0 w-1/2 h-full bg-[#2A866A] dark:bg-[#4ECBA5] rounded-tl-lg border-r border-[#E4F5F0]/20 dark:border-[#0d1b2a]/20"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: doorOpen ? -85 : 0 }}
                transition={{ 
                  duration: 1, 
                  ease: "easeInOut",
                  delay: 0.2
                }}
                style={{ transformOrigin: "left center" }}
              />
              
              {/* Right door */}
              <motion.div 
                className="absolute top-0 right-0 w-1/2 h-full bg-[#2A866A] dark:bg-[#4ECBA5] rounded-tr-lg border-l border-[#E4F5F0]/20 dark:border-[#0d1b2a]/20"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: doorOpen ? 85 : 0 }}
                transition={{ 
                  duration: 1, 
                  ease: "easeInOut",
                  delay: 0.2
                }}
                style={{ transformOrigin: "right center" }}
              />
              
              {/* Light from inside when door opens */}
              <motion.div 
                className="absolute inset-0 bg-white dark:bg-[#E4F5F0] rounded-t-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: doorOpen ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                style={{ zIndex: -1 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
