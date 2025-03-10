
import React, { useEffect, useState } from 'react';

export interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showError, setShowError] = useState(false);
  
  // Call onComplete with a timeout for better user experience
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    
    // Show error after 8 seconds if still loading
    const errorTimer = setTimeout(() => {
      setShowError(true);
    }, 8000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(errorTimer);
    };
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#2A866A] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading application...</p>
        
        {showError && (
          <div className="mt-6 text-red-500 max-w-md p-4 bg-red-50 rounded">
            <p className="font-medium">Taking longer than expected</p>
            <p className="text-sm mt-1">
              There might be an issue connecting to the server. 
              If this continues, try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-600 transition-colors"
            >
              Refresh Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
