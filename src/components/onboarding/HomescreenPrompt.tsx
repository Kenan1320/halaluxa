
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HomescreenPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited) {
      setIsVisible(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="w-full max-w-sm"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Install Halvi App</h3>
                <p className="text-muted-foreground">
                  Add to your homescreen for the best experience
                </p>
                <div className="flex justify-center py-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 0, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="bg-primary text-primary-foreground p-3 rounded-full"
                  >
                    <Share className="w-6 h-6" />
                  </motion.div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>1. Click the share button in your browser</p>
                  <p>2. Select "Add to Home Screen"</p>
                  <p>3. Enjoy the app experience!</p>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-sm text-primary hover:text-primary/80 mt-4"
                >
                  Got it
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomescreenPrompt;
