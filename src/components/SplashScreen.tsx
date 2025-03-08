
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
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#2A866A] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
