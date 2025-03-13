
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Logo and tagline container */}
      <div className="relative flex flex-col items-center">
        {/* Logo with building icon */}
        <motion.div 
          className="relative"
          style={{ 
            filter: `brightness(${brightness})`,
            transition: 'filter 1s ease-in-out'
          }}
        >
          <img 
            src="/lovable-uploads/131eaa02-e39d-48fa-9815-bf019075b771.png" 
            alt="Halvi" 
            className="w-64 h-auto"
          />
        </motion.div>
      </div>

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
          
          {/* Horizontal opening lines */}
          <motion.div
            className="absolute bg-white h-full w-0.5 left-1/2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 100, originX: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
          />
          
          <motion.div
            className="absolute bg-white h-full w-0.5 right-1/2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 100, originX: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
};

export default SplashScreen;
