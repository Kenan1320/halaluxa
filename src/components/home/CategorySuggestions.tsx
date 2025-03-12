
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { Store, ShoppingBag } from 'lucide-react';

const TabItem = ({ isActive, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 relative ${
      isActive ? 'text-black font-bold' : 'text-gray-500'
    }`}
  >
    {icon}
    <span>{children}</span>
    {isActive && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
        layoutId="underline"
        transition={{ duration: 0.3 }}
      />
    )}
  </button>
);

export default function CategorySuggestions() {
  const { mode } = useTheme();
  const [activeTab, setActiveTab] = useState('nearby');
  
  return (
    <div className="py-4">
      <div className="flex border-b border-gray-200 mb-6">
        <TabItem
          isActive={activeTab === 'nearby'}
          onClick={() => setActiveTab('nearby')}
          icon={getCategoryIcon('Groceries', 'w-5 h-5')}
        >
          Shop Nearby
        </TabItem>
        <TabItem
          isActive={activeTab === 'online'}
          onClick={() => setActiveTab('online')}
          icon={getCategoryIcon('Online Shops', 'w-5 h-5')}
        >
          Shop Online
        </TabItem>
      </div>
    </div>
  );
}
