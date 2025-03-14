
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Flame } from 'lucide-react';

interface SwitchableTabsProps {
  onTabChange: (tab: string) => void;
}

const SwitchableTabs: React.FC<SwitchableTabsProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('forYou');
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };
  
  return (
    <div className="max-w-sm mx-auto bg-gray-100 p-1 rounded-full flex mt-8">
      <button
        onClick={() => handleTabChange('forYou')}
        className={`flex-1 flex items-center justify-center py-3 ${
          activeTab === 'forYou' 
            ? 'bg-black text-white rounded-full' 
            : 'text-black'
        }`}
      >
        <Star 
          size={16} 
          className={`mr-2 ${activeTab === 'forYou' ? 'text-white' : 'text-black'}`} 
          fill={activeTab === 'forYou' ? 'white' : 'none'} 
        />
        For You
      </button>
      
      <button
        onClick={() => handleTabChange('popular')}
        className={`flex-1 flex items-center justify-center py-3 ${
          activeTab === 'popular' 
            ? 'bg-black text-white rounded-full' 
            : 'text-black'
        }`}
      >
        <Flame 
          size={16} 
          className={`mr-2 ${activeTab === 'popular' ? 'text-white' : 'text-black'}`}
          fill={activeTab === 'popular' ? 'white' : 'none'}
        />
        Popular
      </button>
    </div>
  );
};

export default SwitchableTabs;
