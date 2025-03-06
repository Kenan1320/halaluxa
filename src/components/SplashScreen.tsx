
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen = ({ onFinished }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [secondTaglineVisible, setSecondTaglineVisible] = useState(false);
  const [waveComplete, setWaveComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show primary tagline after a delay
    const taglineTimer = setTimeout(() => {
      setTaglineVisible(true);
    }, 1800);

    // Show secondary tagline after a longer delay
    const secondTaglineTimer = setTimeout(() => {
      setSecondTaglineVisible(true);
    }, 2300);

    // Hide splash screen after desired duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for exit animation before calling onFinished
      setTimeout(onFinished, 900);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(taglineTimer);
      clearTimeout(secondTaglineTimer);
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
  
  // Rainbow color animation for Haluna text
  const colors = ["#29866B", "#36A186", "#E4875E", "#F9A280", "#29866B"];

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
          {/* Light green background matching the top nav */}
          <div className="absolute inset-0 bg-[#E4F5F0]" />
          
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
            {/* Brand name with letter-by-letter reveal and color animation */}
            <div className="flex overflow-hidden">
              {brandName.split('').map((letter, i) => (
                <motion.span
                  key={`letter-${i}`}
                  custom={i}
                  variants={letterVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-white text-[4.5rem] font-serif font-bold tracking-wide"
                  style={{
                    background: `linear-gradient(to right, ${colors.join(', ')})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% auto',
                  }}
                  animate={{
                    backgroundPosition: ['0% center', '200% center'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'linear',
                    delay: 1.5 + (i * 0.2)
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            
            {/* Primary Tagline - Bold and elegant */}
            <motion.p
              className="text-white text-opacity-95 text-base font-medium tracking-wider mt-1"
              initial={{ opacity: 0, y: 10 }}
              animate={taglineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              The Muslim Shops and Businesses
            </motion.p>
            
            {/* Secondary Tagline - Different color */}
            <motion.p
              className="text-[#F9F5EB] text-opacity-90 text-sm tracking-wider mt-0.5 font-light"
              initial={{ opacity: 0, y: 10 }}
              animate={secondTaglineVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              Shop Your Muslim Shops Nearby & Beyond
            </motion.p>
            
            {/* Logo animation container */}
            <motion.div
              className="mt-8 relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: waveComplete ? 1 : 0, 
                opacity: waveComplete ? 1 : 0 
              }}
              transition={{ 
                delay: 0.2, 
                duration: 0.7,
                ease: "easeOut"
              }}
            >
              {/* Main orange ball */}
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
              
              {/* Orbiting green ball */}
              <motion.div
                className="absolute w-6 h-6 bg-[#29866B] rounded-full shadow-md"
                animate={{
                  x: [15, 12, 0, -12, -15, -12, 0, 12, 15],
                  y: [0, 12, 15, 12, 0, -12, -15, -12, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
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
