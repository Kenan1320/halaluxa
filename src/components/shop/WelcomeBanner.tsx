
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

const WelcomeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { user } = useAuth();
  
  // Get time of day for greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  if (!user || dismissed) {
    return null;
  }
  
  const displayName = user.name || 'Shopper';
  
  return (
    <div className="bg-gradient-to-r from-haluna-primary-light/30 to-purple-100 rounded-lg shadow-sm p-4 mb-6 transition-all">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-serif">
            {getTimeBasedGreeting()}, <span className="font-semibold">{displayName}</span>!
          </h2>
          <p className="text-haluna-text-light mt-1">
            Welcome back to Haluna. Discover new arrivals and shop from your favorite stores.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default WelcomeBanner;
