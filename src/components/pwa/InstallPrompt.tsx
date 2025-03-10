
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  
  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    
    // For iOS
    if (
      ('standalone' in window.navigator) && 
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }
    
    // Capture the install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome from automatically showing the prompt
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowPrompt(true);
    };
    
    // Check if user has previously dismissed the prompt
    const hasUserDismissedPrompt = localStorage.getItem('installPromptDismissed');
    if (hasUserDismissedPrompt) {
      const dismissedTime = parseInt(hasUserDismissedPrompt, 10);
      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      
      // If it's been less than a day since dismissal, don't show the prompt
      if (now - dismissedTime < oneDayInMs) {
        return;
      }
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    // We no longer need the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
    
    // Log the result
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
      // Record when the user dismissed the prompt
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    }
  };
  
  const handleDismiss = () => {
    setShowPrompt(false);
    // Record when the user dismissed the prompt
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };
  
  // If the app is already installed or the prompt isn't available, don't show anything
  if (isInstalled || !showPrompt) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:bottom-4 md:max-w-sm"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-lg flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-[#2A866A] dark:text-[#4ECBA5]" />
                  Install Halvi App
                </h3>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Install Halvi on your home screen for a better experience with offline access and notifications.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="flex-1"
              >
                Later
              </Button>
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex-1 gap-1"
              >
                <Download className="h-4 w-4" />
                Install
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
