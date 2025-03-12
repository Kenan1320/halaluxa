
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { productCategories } from '@/models/product';

const TabItem = ({ isActive, onClick, icon, children }: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 relative font-heading ${
      isActive ? 'text-black dark:text-white font-extrabold' : 'text-gray-500 dark:text-gray-400'
    }`}
  >
    {icon}
    <span className="text-xl font-heading font-bold">{children}</span>
    {isActive && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
        layoutId="underline"
        transition={{ duration: 0.3 }}
      />
    )}
  </button>
);

const CategoryIcon = ({ category, onClick, isSelected }: { 
  category: string; 
  onClick: () => void;
  isSelected?: boolean;
}) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center space-y-2 min-w-fit cursor-pointer"
  >
    <div className="w-12 h-12 flex items-center justify-center">
      {getCategoryIcon(category, `w-8 h-8 ${isSelected ? 'text-[#29866B]' : ''}`)}
    </div>
    <span className={`text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap ${isSelected ? 'font-bold text-[#29866B] dark:text-[#5bbea7]' : ''}`}>
      {category}
    </span>
  </div>
);

export default function CategorySuggestions() {
  const { mode } = useTheme();
  const [activeTab, setActiveTab] = useState('nearby');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const nearbyCategories = ['Groceries', 'Restaurants', 'Halal Meat', 'Coffee Shops'];
  const onlineCategories = ['Online Shops', 'Gifts', 'Hoodies', 'Books'];
  
  return (
    <div className="py-4">
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
        <TabItem
          isActive={activeTab === 'nearby'}
          onClick={() => {
            setActiveTab('nearby');
            setSelectedCategory(null);
          }}
          icon={getCategoryIcon('Groceries', 'w-5 h-5')}
        >
          Halvi't Nearby
        </TabItem>
        <TabItem
          isActive={activeTab === 'online'}
          onClick={() => {
            setActiveTab('online');
            setSelectedCategory(null);
          }}
          icon={getCategoryIcon('Online Shops', 'w-5 h-5')}
        >
          Halvi Mall
        </TabItem>
      </div>
      
      {/* Categories scroll section */}
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex space-x-6 pb-4 min-w-max px-2">
          {(activeTab === 'nearby' ? nearbyCategories : onlineCategories).map((category) => (
            <CategoryIcon 
              key={category} 
              category={category}
              isSelected={selectedCategory === category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
