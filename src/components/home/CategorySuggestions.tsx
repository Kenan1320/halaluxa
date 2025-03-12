
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { getCategoriesByGroup, Category } from '@/services/categoryService';

const TabItem = ({ isActive, onClick, icon, children }: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 relative ${
      isActive ? 'text-black dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'
    }`}
    style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
  >
    {icon}
    <span className="text-base font-semibold">{children}</span>
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
  category: Category; 
  onClick: () => void;
  isSelected?: boolean;
}) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer px-1"
  >
    <div className={`w-14 h-14 flex items-center justify-center ${
      isSelected ? 'text-[#29866B]' : 'text-gray-600 dark:text-gray-300'
    }`}>
      {getCategoryIcon(category.name, `w-8 h-8 ${isSelected ? 'text-[#29866B]' : 'text-gray-600 dark:text-gray-300'}`)}
    </div>
    <span className={`text-xs text-center text-gray-600 dark:text-gray-300 whitespace-nowrap ${
      isSelected ? 'font-bold text-[#2A866A] dark:text-[#5bbea7]' : ''
    }`}>
      {category.name}
    </span>
  </div>
);

export default function CategorySuggestions() {
  const { mode } = useTheme();
  const [activeTab, setActiveTab] = useState<'nearby' | 'online'>('nearby');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [nearbyCategories, setNearbyCategories] = useState<Category[]>([]);
  const [onlineCategories, setOnlineCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      const nearby = await getCategoriesByGroup('nearby');
      const online = await getCategoriesByGroup('online');
      setNearbyCategories(nearby);
      setOnlineCategories(online);
    };
    
    loadCategories();
  }, []);
  
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
        <div className="flex space-x-4 pb-4 min-w-max px-2">
          {(activeTab === 'nearby' ? nearbyCategories : onlineCategories).map((category) => (
            <CategoryIcon 
              key={category.id} 
              category={category}
              isSelected={selectedCategory === category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
