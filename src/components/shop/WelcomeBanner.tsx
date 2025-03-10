
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface WelcomeBannerProps {
  userName: string;
  role: 'shopper' | 'business' | string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName, role }) => {
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-haluna-primary to-purple-600 text-white py-3 px-4 shadow-md"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <span className="font-medium">{getGreeting()}, {userName}!</span>
          {role === 'shopper' && (
            <span className="ml-2 hidden sm:inline">
              Welcome back to Haluna. Find halal products from Muslim-owned businesses.
            </span>
          )}
          {role === 'business' && (
            <span className="ml-2 hidden sm:inline">
              Welcome to your business dashboard. Manage your products and orders.
            </span>
          )}
        </div>
        <button
          onClick={() => setVisible(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
