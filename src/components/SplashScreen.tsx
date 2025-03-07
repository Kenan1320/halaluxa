
import React from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

// Simplified splash screen that completes immediately
const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Call onComplete immediately
  React.useEffect(() => {
    onComplete();
  }, [onComplete]);
  
  // Return an empty div - this component will be unmounted immediately
  return null;
};

export default SplashScreen;
