
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(1); // 1: Initial, 2: Illumination, 3: Opening

  useEffect(() => {
    // Phase 1: Initial display (1 second)
    const timer1 = setTimeout(() => {
      setStage(2); // Move to illumination phase
    }, 1000);

    // Phase 2: Illumination transition (1 second)
    const timer2 = setTimeout(() => {
      setStage(3); // Move to opening effect phase
    }, 2000);

    // Final phase: Complete animation and call onComplete
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Calculate brightness based on stage
  const brightness = stage === 1 ? 0.7 : stage === 2 ? 0.9 : 1;
  
  // Logo opacity (fade out during door opening)
  const logoOpacity = stage === 3 ? 0 : 1;

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Logo and tagline container */}
      <AnimatePresence>
        {(stage === 1 || stage === 2 || (stage === 3 && logoOpacity > 0)) && (
          <motion.div 
            className="relative flex flex-col items-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: logoOpacity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo with building icon */}
            <motion.div 
              className="relative"
              style={{ 
                filter: `brightness(${brightness})`,
                transition: 'filter 1s ease-in-out'
              }}
            >
              <img 
                src="/logo-full-white.svg" 
                alt="Halvi" 
                className="w-64 h-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated lines */}
      {stage === 3 && (
        <>
          {/* Top vertical line */}
          <motion.div
            className="absolute bg-white w-1"
            initial={{ height: 0, top: '50%', left: '50%', translateX: '-50%' }}
            animate={{ height: '50%', top: '0%' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          
          {/* Bottom vertical line */}
          <motion.div
            className="absolute bg-white w-1"
            initial={{ height: 0, bottom: '50%', left: '50%', translateX: '-50%' }}
            animate={{ height: '50%', bottom: '0%' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          
          {/* Left door panel */}
          <motion.div
            className="absolute bg-black h-full left-0"
            initial={{ width: '50%' }}
            animate={{ width: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
            style={{ 
              borderRight: '1px solid white',
              zIndex: 60
            }}
          />
          
          {/* Right door panel */}
          <motion.div
            className="absolute bg-black h-full right-0"
            initial={{ width: '50%' }}
            animate={{ width: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
            style={{ 
              borderLeft: '1px solid white',
              zIndex: 60
            }}
          />
        </>
      )}
    </div>
  );
};

export default SplashScreen;
