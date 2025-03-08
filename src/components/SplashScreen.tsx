
import React, { useEffect } from 'react';

export interface SplashScreenProps {
  onComplete: () => void;
}

// Immediately completes without showing a splash screen
const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Call onComplete immediately without any delay
  React.useEffect(() => {
    onComplete();
  }, [onComplete]);
  
  // Return null to not render anything
  return null;
};

export default SplashScreen;
