
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
    }, 3000); // 3 seconds display time

    return () => clearTimeout(timer);
  }, [onFinished]);

  // Animation variants for the logo text
  const letterVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const letterChildVariants = {
    initial: { color: "#2A866A" },
    animate: { 
      color: ["#2A866A", "#3A9E7E", "#2F9173", "#1F7A5C", "#2A866A"],
      transition: { 
        duration: 8, 
        repeat: Infinity,
        repeatType: "reverse" as const
      } 
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A866A]/10"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="relative flex flex-col items-center justify-center w-full max-w-lg">
            {/* Haluna Logo and Pulse Ball */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="text-center mb-3">
                <motion.h1 
                  className="text-[4rem] font-bold flex"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  {Array.from("Haluna").map((letter, index) => (
                    <motion.span
                      key={index}
                      variants={letterChildVariants}
                      initial="initial"
                      animate="animate"
                      style={{ display: 'inline-block' }}
                      className="font-serif"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.h1>
              </div>
              
              {/* Orange Ball with Pulse */}
              <motion.div
                className="mt-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <motion.div
                  className="w-10 h-10 bg-orange-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7] 
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
