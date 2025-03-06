
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPremiumGradient } from '@/lib/utils';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen = ({ onFinished }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [waveComplete, setWaveComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show tagline after a delay
    const taglineTimer = setTimeout(() => {
      setTaglineVisible(true);
    }, 1800);

    // Hide splash screen after desired duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for exit animation before calling onFinished
      setTimeout(onFinished, 900);
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(taglineTimer);
    };
  }, [onFinished]);

  // Text reveal animation for each letter
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2 + (i * 0.1),
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  const brandName = "Haluna";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Pastel green background (#E5F4EF) */}
          <div className="absolute inset-0 bg-[#E5F4EF]" />
          
          {/* Wave animation container */}
          <div className="absolute inset-0 flex flex-col justify-end overflow-hidden">
            {/* First wave - Deep green (#29866B) */}
            <motion.div
              className="w-full h-[60%] bg-[#29866B] rounded-t-[100%]"
              initial={{ y: "100%" }}
              animate={{ 
                y: "0%",
                transition: { 
                  duration: 1.8, 
                  ease: [0.22, 1, 0.36, 1],
                }
              }}
              onAnimationComplete={() => setWaveComplete(true)}
            />
            
            {/* Second wave - Warm orange (#E4875E) with blend into green */}
            <motion.div
              className="absolute bottom-0 w-full h-[45%] bg-gradient-to-t from-[#E4875E] to-[#29866B] rounded-t-[100%]"
              initial={{ y: "100%" }}
              animate={{ 
                y: "0%",
                transition: { 
                  duration: 1.8, 
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2 
                }
              }}
            />
          </div>

          {/* Content container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Brand name with letter-by-letter reveal */}
            <div className="flex overflow-hidden">
              {brandName.split('').map((letter, i) => (
                <motion.span
                  key={`letter-${i}`}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-white text-[4.5rem] font-serif font-bold tracking-wide"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            
            {/* Tagline */}
            <motion.p
              className="text-white text-opacity-90 text-sm tracking-wider mt-1 font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={taglineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              Where You Shop Your Muslim Shops Nearby and Beyond
            </motion.p>
            
            {/* Circular element */}
            <motion.div
              className="mt-6"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: waveComplete ? 1 : 0, 
                opacity: waveComplete ? 0.85 : 0 
              }}
              transition={{ 
                delay: 0.2, 
                duration: 0.7,
                ease: "easeOut"
              }}
            >
              <motion.div
                className="w-14 h-14 bg-[#E4875E] rounded-full flex items-center justify-center"
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
                <div className="w-10 h-10 rounded-full border-2 border-white border-opacity-40"></div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
