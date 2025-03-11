
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
    }, 3500);
    
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
          className="fixed inset-0 flex flex-col items-center justify-center bg-[#E4F5F0] dark:bg-[#0d1b2a] black:bg-black z-50"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center">
            {/* Minimalist Mall Logo */}
            <motion.div 
              className="flex flex-col items-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-24 h-24 mb-3">
                <motion.div
                  className="absolute inset-0 bg-[#2A866A]/20 dark:bg-[#4ECBA5]/10 black:bg-[#00C8FF]/10 rounded-full"
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
                
                {/* Minimalist Mall Icon */}
                <motion.svg 
                  viewBox="0 0 100 100" 
                  className="w-full h-full absolute top-0 left-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#2A866A" strokeWidth="2" className="dark:stroke-[#4ECBA5] black:stroke-[#00C8FF]" />
                  
                  {/* Mall Building */}
                  <rect x="30" y="35" width="40" height="40" fill="none" stroke="#2A866A" strokeWidth="2" rx="2" className="dark:stroke-[#4ECBA5] black:stroke-[#00C8FF]" />
                  
                  {/* Windows */}
                  <rect x="35" y="40" width="8" height="8" fill="#2A866A" className="dark:fill-[#4ECBA5] black:fill-[#00C8FF]" rx="1" />
                  <rect x="46" y="40" width="8" height="8" fill="#2A866A" className="dark:fill-[#4ECBA5] black:fill-[#00C8FF]" rx="1" />
                  <rect x="57" y="40" width="8" height="8" fill="#2A866A" className="dark:fill-[#4ECBA5] black:fill-[#00C8FF]" rx="1" />
                  
                  <rect x="35" y="52" width="8" height="8" fill="#2A866A" className="dark:fill-[#4ECBA5] black:fill-[#00C8FF]" rx="1" />
                  <rect x="57" y="52" width="8" height="8" fill="#2A866A" className="dark:fill-[#4ECBA5] black:fill-[#00C8FF]" rx="1" />
                  
                  {/* Door */}
                  <rect x="46" y="52" width="8" height="16" fill="#2A866A" className="dark:fill-[#4ECBA5] black:fill-[#00C8FF]" rx="1" />
                  
                  {/* Roof */}
                  <path d="M 28 35 L 50 25 L 72 35" fill="none" stroke="#2A866A" strokeWidth="2" className="dark:stroke-[#4ECBA5] black:stroke-[#00C8FF]" />
                </motion.svg>
              </div>
            </motion.div>
            
            {/* Tagline with word-by-word animation */}
            <div className="h-8 flex items-center justify-center space-x-2 mt-2">
              {showTagline && (
                <>
                  <motion.span 
                    className="text-lg text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF] opacity-0 font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={showWord1 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    The
                  </motion.span>
                  <motion.span 
                    className="text-lg text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF] opacity-0 font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={showWord2 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    Halal
                  </motion.span>
                  <motion.span 
                    className="text-lg text-[#2A866A] dark:text-[#4ECBA5] black:text-[#00C8FF] opacity-0 font-medium tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={showWord3 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    Village
                  </motion.span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
