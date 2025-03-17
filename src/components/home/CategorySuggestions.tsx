
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingBag, MapPin, Shirt, Globe, TrendingUp, Coffee, Book, Utensils, Home as HomeIcon, Gift, Palette, Scissors } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

type CategoryType = "nearby" | "online" | "transitional" | "featured" | "popular";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: CategoryType;
}

const CATEGORIES: Category[] = [
  // Local Categories
  {
    id: "local-restaurants",
    name: "Local Halal Restaurants",
    icon: <Utensils className="h-5 w-5" />,
    type: "nearby"
  },
  {
    id: "butcher-shops",
    name: "Halal Butcher Shops",
    icon: <Scissors className="h-5 w-5" />,
    type: "nearby"
  },
  {
    id: "grocery-stores",
    name: "Local Halal Grocery Stores",
    icon: <ShoppingBag className="h-5 w-5" />,
    type: "nearby"
  },
  {
    id: "wellness-centers",
    name: "Halal Wellness & Therapy Centers",
    icon: <TrendingUp className="h-5 w-5" />,
    type: "nearby"
  },
  
  // Transitioning (Could Be Local or Online)
  {
    id: "home-furniture",
    name: "Home & Furniture Stores",
    icon: <HomeIcon className="h-5 w-5" />,
    type: "transitional"
  },
  {
    id: "islamic-decor",
    name: "Islamic Home Decor & Accessories",
    icon: <HomeIcon className="h-5 w-5" />,
    type: "transitional"
  },
  {
    id: "islamic-art",
    name: "Islamic Art & Calligraphy Services",
    icon: <Palette className="h-5 w-5" />,
    type: "transitional"
  },
  {
    id: "islamic-gifts",
    name: "Islamic Gifts & Specialty Shops",
    icon: <Gift className="h-5 w-5" />,
    type: "transitional"
  },
  
  // Online Categories
  {
    id: "halvi-marketplace",
    name: "Halvi Marketplace",
    icon: <Globe className="h-5 w-5" />,
    type: "online"
  },
  {
    id: "learn-arabic",
    name: "Learn Arabic",
    icon: <Book className="h-5 w-5" />,
    type: "online"
  },
  {
    id: "modest-hijabs",
    name: "Modest Wear - Hijabs",
    icon: <Shirt className="h-5 w-5" />,
    type: "online"
  },
  {
    id: "modest-abayas",
    name: "Modest Wear - Abayas & Dresses",
    icon: <Shirt className="h-5 w-5" />,
    type: "online"
  },
  {
    id: "mens-islamic-wear",
    name: "Men's Islamic Wear - Thobes & Jubbas",
    icon: <Shirt className="h-5 w-5" />,
    type: "online"
  },
  {
    id: "islamic-books",
    name: "Islamic Books & More",
    icon: <Book className="h-5 w-5" />,
    type: "online"
  }
];

const typeLabels: Record<CategoryType, string> = {
  "nearby": "Local",
  "online": "Online",
  "transitional": "Local & Online",
  "featured": "Featured",
  "popular": "Popular"
};

const CategorySuggestions = () => {
  const [selectedType, setSelectedType] = useState<CategoryType>("nearby");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { mode } = useTheme();
  
  useEffect(() => {
    setFilteredCategories(CATEGORIES.filter(cat => cat.type === selectedType));
  }, [selectedType]);
  
  const handleCategoryClick = (categoryId: string) => {
    // Navigate to the category page or search with this category
    navigate(`/browse?category=${categoryId}`);
  };
  
  const tabColors: Record<CategoryType, string> = {
    "nearby": "bg-emerald-500 dark:bg-emerald-600",
    "online": "bg-blue-500 dark:bg-blue-600",
    "transitional": "bg-purple-500 dark:bg-purple-600",
    "featured": "bg-amber-500 dark:bg-amber-600",
    "popular": "bg-red-500 dark:bg-red-600"
  };

  return (
    <div className="mt-8 mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto px-4">
        <button
          className={`py-2 px-4 rounded-full text-white text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-all ${selectedType === 'nearby' ? tabColors['nearby'] : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          onClick={() => setSelectedType('nearby')}
        >
          <MapPin className="h-4 w-4" />
          <span className="hidden md:inline">Local</span>
        </button>
        
        <button
          className={`py-2 px-4 rounded-full text-white text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-all ${selectedType === 'transitional' ? tabColors['transitional'] : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          onClick={() => setSelectedType('transitional')}
        >
          <HomeIcon className="h-4 w-4" />
          <span className="hidden md:inline">Local & Online</span>
        </button>
        
        <button
          className={`py-2 px-4 rounded-full text-white text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-all ${selectedType === 'online' ? tabColors['online'] : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          onClick={() => setSelectedType('online')}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">Online</span>
        </button>
        
        <button
          className={`py-2 px-4 rounded-full text-white text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-all ${selectedType === 'popular' ? tabColors['popular'] : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          onClick={() => setSelectedType('popular')}
        >
          <TrendingUp className="h-4 w-4" />
          <span className="hidden md:inline">Popular</span>
        </button>
      </div>
      
      <div className="mt-6">
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 ${
          isMobile ? 'max-h-[300px] overflow-y-auto' : ''
        }`}>
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleCategoryClick(category.id)}
              className={`${
                mode === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' 
                  : 'bg-white hover:bg-gray-50 border-gray-100'
              } border rounded-lg p-4 cursor-pointer transition-all shadow-sm hover:shadow`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  tabColors[category.type].replace('bg-', 'bg-opacity-10 text-').replace('dark:bg-', 'dark:text-')
                }`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${
                    mode === 'dark' ? 'text-white' : 'text-gray-700'
                  } font-medium line-clamp-2`}>
                    {category.name}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySuggestions;
