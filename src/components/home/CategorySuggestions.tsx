
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { Store, ShoppingBag } from 'lucide-react';

const TabItem = ({ isActive, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 relative font-heading ${
      isActive ? 'text-black dark:text-white font-extrabold' : 'text-gray-500 dark:text-gray-400'
    }`}
  >
    {icon}
    <span className="text-lg">{children}</span>
    {isActive && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
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
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
        <TabItem
          isActive={activeTab === 'nearby'}
          onClick={() => setActiveTab('nearby')}
          icon={getCategoryIcon('Groceries', 'w-5 h-5')}
        >
          Halvi't Nearby
        </TabItem>
        <TabItem
          isActive={activeTab === 'online'}
          onClick={() => setActiveTab('online')}
          icon={getCategoryIcon('Online Shops', 'w-5 h-5')}
        >
          Halvi't Online
        </TabItem>
      </div>
      
      {/* Categories scroll section */}
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex space-x-4 pb-4 min-w-max">
          {productCategories.filter(cat => 
            activeTab === 'nearby' ? 
              ['Groceries', 'Restaurants', 'Halal Meat', 'Furniture', 'Coffee Shops'].includes(cat) :
              ['Online Shops', 'Gifts', 'Hoodies', 'Books', 'Thobes'].includes(cat)
          ).map((category) => (
            <div key={category} className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                {getCategoryIcon(category, 'w-8 h-8')}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
