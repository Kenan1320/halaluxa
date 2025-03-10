
import React, { useEffect } from 'react';

export interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Call onComplete immediately
  useEffect(() => {
    onComplete();
  }, [onComplete]);
  
  // Return an empty div - essentially removing the splash screen
  return null;
};

export default SplashScreen;
