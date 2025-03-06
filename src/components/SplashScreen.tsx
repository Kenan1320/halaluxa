
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart, Gift } from 'lucide-react';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-haluna-primary via-haluna-primary-dark to-emerald-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
      >
        {/* Logo Circle Animation */}
        <motion.div 
          className="relative w-32 h-32 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: 1,
            repeatType: "mirror"
          }}
        >
          {/* Outer circle */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-white opacity-20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: 1, repeatType: "reverse" }}
          />
          
          {/* Inner circle */}
          <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <motion.span 
              className="text-4xl font-serif font-bold text-haluna-primary"
              variants={{
                animate: {
                  color: ["#2A866A", "#1e5c4a", "#2A866A"],
                  transition: { duration: 2, repeat: 1, repeatType: "reverse" }
                }
              }}
              initial="initial"
              animate="animate"
            >
              H
            </motion.span>
            
            {/* Orbiting icons */}
            {[0, 72, 144, 216, 288].map((degree, index) => (
              <motion.div
                key={index}
                className="absolute"
                style={{ 
                  transformOrigin: 'center',
                  rotate: `${degree}deg`,
                }}
                animate={{ rotate: `${degree + 360}deg` }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <motion.div
                  className="absolute"
                  style={{ left: 60, top: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, delay: index * 0.2, repeat: Infinity }}
                >
                  {index === 0 && <ShoppingBag size={16} className="text-white" />}
                  {index === 1 && <Heart size={16} className="text-white" />}
                  {index === 2 && <Star size={16} className="text-white" />}
                  {index === 3 && <Gift size={16} className="text-white" />}
                  {index === 4 && <ShoppingBag size={16} className="text-white" />}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.h1 
          className="text-3xl md:text-4xl font-serif font-bold text-white"
          animate={{ 
            textShadow: ["0px 0px 8px rgba(255,255,255,0.3)", "0px 0px 16px rgba(255,255,255,0.5)", "0px 0px 8px rgba(255,255,255,0.3)"] 
          }}
          transition={{ duration: 2, repeat: 1, repeatType: "reverse" }}
        >
          Haluna
        </motion.h1>
        
        <motion.p 
          className="text-white text-lg mt-4 italic font-medium max-w-xs mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Shop Muslim Shops and Businesses
        </motion.p>
      </motion.div>
      
      <motion.div
        className="absolute bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1.5, duration: 1.5, repeat: 1, repeatType: "reverse" }}
      >
        <p className="text-white/80 text-sm">Loading your experience...</p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
