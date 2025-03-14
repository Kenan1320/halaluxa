
import React, { useEffect } from 'react';

export interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Call onComplete with a minimal delay for better user experience
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 800);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center deep-night-blue-gradient z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-white">Loading...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
