
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
      className="w-6 h-6"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.div>
    <span className="text-sm font-medium">{children}</span>
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
    className="flex flex-col items-center space-y-1 min-w-[70px] cursor-pointer"
  >
    <motion.div 
      className="w-14 h-14 flex items-center justify-center"
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
      {getCategoryIcon(category.name, `w-10 h-10 ${isSelected ? 'text-[#29866B]' : 'text-gray-600 dark:text-gray-300'}`)}
    </motion.div>
    <span className={`text-xs font-bold text-center text-gray-600 dark:text-gray-300 ${
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

// Component to display the custom uploaded icons
const CustomTabIcon = ({ type }: { type: 'nearby' | 'online' }) => {
  if (type === 'nearby') {
    return (
      <img 
        src="/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png" 
        alt="Halvi't Nearby" 
        className="w-6 h-6"
      />
    );
  } else {
    return (
      <img 
        src="/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png" 
        alt="Halvi Mall" 
        className="w-6 h-6" 
      />
    );
  }
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
  
  return (
    <div className="py-4">
      <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
        <TabItem
          isActive={activeTab === 'nearby'}
          onClick={() => {
            setActiveTab('nearby');
            setSelectedCategory(null);
          }}
          icon={<CustomTabIcon type="nearby" />}
        >
          Halvi't Nearby
        </TabItem>
        <TabItem
          isActive={activeTab === 'online'}
          onClick={() => {
            setActiveTab('online');
            setSelectedCategory(null);
          }}
          icon={<CustomTabIcon type="online" />}
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
      
      {/* Subtle divider */}
      <div className="border-b border-gray-200 dark:border-gray-700 opacity-40 w-full my-2"></div>
    </div>
  );
}
