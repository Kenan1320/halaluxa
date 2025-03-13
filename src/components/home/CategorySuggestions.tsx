
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
    <motion.div
      className="w-8 h-8" /* Increased icon size */
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.div>
    <span className="text-sm font-semibold">{children}</span>
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
  <motion.div 
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center space-y-2 min-w-[70px] cursor-pointer px-1"
  >
    <motion.div 
      className={`w-16 h-16 flex items-center justify-center ${
        isSelected ? 'text-[#29866B]' : 'text-gray-600 dark:text-gray-300'
      }`}
      initial={{ rotateX: 0 }}
      whileHover={{ 
        rotateX: 10,
        rotateY: 10,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" 
      }}
      style={{ 
        transformStyle: "preserve-3d", 
        perspective: "500px" 
      }}
    >
      {getCategoryIcon(category.name, `w-11 h-11 ${isSelected ? 'text-[#29866B]' : 'text-gray-600 dark:text-gray-300'}`)}
    </motion.div>
    <span className={`text-xs font-medium text-center text-gray-600 dark:text-gray-300 whitespace-nowrap ${
      isSelected ? 'text-[#2A866A] dark:text-[#5bbea7]' : ''
    }`}>
      {category.name}
    </span>
  </motion.div>
);

const getOrderedCategories = (categories: Category[], mode: 'nearby' | 'online'): Category[] => {
  const orderMap: Record<string, number> = {};
  
  if (mode === 'nearby') {
    // Define the order for Halvi't Nearby
    ['Groceries', 'Restaurants', 'Coffee Shops', 'Halal Meat'].forEach((name, index) => {
      orderMap[name] = index;
    });
  } else {
    // Define the order for Halvi Mall
    ['Online Shops', 'Hoodies', 'Thobes', 'Abayas'].forEach((name, index) => {
      orderMap[name] = index;
    });
  }
  
  // Sort the categories based on the defined order
  return [...categories].sort((a, b) => {
    const aOrder = orderMap[a.name] !== undefined ? orderMap[a.name] : 999;
    const bOrder = orderMap[b.name] !== undefined ? orderMap[b.name] : 999;
    return aOrder - bOrder;
  });
};

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
  
  // Custom icons for the tabs
  const getNearbyIcon = () => (
    <img 
      src="/lovable-uploads/89ad3be3-b680-4a28-9a6b-e050599916e9.png" 
      alt="Nearby" 
      className="w-8 h-8" /* Increased icon size */
    />
  );

  const getMallIcon = () => (
    <img 
      src="/lovable-uploads/15e23db4-7e8d-43bd-b55c-6941efd2e733.png" 
      alt="Mall" 
      className="w-8 h-8" /* Increased icon size and updated image */
    />
  );
  
  return (
    <div className="pt-2 pb-2">
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-5">
        <TabItem
          isActive={activeTab === 'nearby'}
          onClick={() => {
            setActiveTab('nearby');
            setSelectedCategory(null);
          }}
          icon={getNearbyIcon()}
        >
          Halvi't Nearby
        </TabItem>
        <TabItem
          isActive={activeTab === 'online'}
          onClick={() => {
            setActiveTab('online');
            setSelectedCategory(null);
          }}
          icon={getMallIcon()}
        >
          Halvi Mall
        </TabItem>
      </div>
      
      {/* Categories scroll section */}
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex space-x-4 pb-4 min-w-max px-2">
          {getOrderedCategories(
            activeTab === 'nearby' ? nearbyCategories : onlineCategories,
            activeTab
          ).map((category) => (
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
