
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { getCategoryIcon } from '../icons/CategoryIcons';
import { productCategories, isNearbyCategoryByDefault } from '@/models/product';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronRight } from 'lucide-react';

export default function CategorySuggestions() {
  const { mode } = useTheme();
  const [activeTab, setActiveTab] = useState<'nearby' | 'online'>('nearby');
  const isMobile = useIsMobile();
  const [nearbyCategories, setNearbyCategories] = useState<string[]>([]);
  const [onlineCategories, setOnlineCategories] = useState<string[]>([]);
  
  useEffect(() => {
    // Filter categories
    setNearbyCategories(productCategories.filter(isNearbyCategoryByDefault).slice(0, 6));
    setOnlineCategories(productCategories.filter(cat => !isNearbyCategoryByDefault(cat)).slice(0, 6));
  }, []);
  
  const categories = activeTab === 'nearby' ? nearbyCategories : onlineCategories;

  return (
    <div className="py-2">
      <div className="flex justify-between items-center mb-3">
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-xs">
          <button
            className={`px-3 py-1.5 text-xs font-medium ${
              activeTab === 'nearby'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black dark:bg-gray-800 dark:text-white'
            }`}
            onClick={() => setActiveTab('nearby')}
          >
            Shop Nearby
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-medium ${
              activeTab === 'online'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black dark:bg-gray-800 dark:text-white'
            }`}
            onClick={() => setActiveTab('online')}
          >
            Shop Online
          </button>
        </div>
        
        <Link 
          to="/browse" 
          className="text-[10px] font-medium flex items-center text-black dark:text-white"
        >
          See All
          <ChevronRight className="h-3 w-3 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            className="group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3 }}
          >
            <Link 
              to={`/browse?category=${encodeURIComponent(category)}`}
              className="flex flex-col items-center gap-1 p-1"
            >
              <motion.div 
                className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-full"
                whileHover={{ scale: 1.1, backgroundColor: mode === 'dark' ? '#2A866A20' : '#E4F5F0' }}
              >
                {getCategoryIcon(category, "w-6 h-6")}
              </motion.div>
              <span className={`text-[10px] font-medium text-center mt-1 line-clamp-1 ${
                mode === 'dark' ? 'text-white' : 'text-black'
              }`}>
                {category}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
