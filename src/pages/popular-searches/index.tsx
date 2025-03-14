
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { productCategories } from '@/models/product';

const PopularSearchesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  
  // Simulate popular searches based on product categories
  useEffect(() => {
    // Generate some mock popular searches
    const mockPopularSearches = [
      "Halal Meat",
      "Abayas",
      "Islamic Books",
      "Prayer Mats",
      "Hijabs",
      "Thobes",
      "Dates",
      "Ramadan Decorations",
      "Quranic Art",
      "Modest Fashion",
      "Arabic Coffee",
      "Halal Snacks"
    ];
    
    setPopularSearches(mockPopularSearches);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const handlePopularSearchClick = (term: string) => {
    navigate(`/browse?search=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
          Popular Searches
        </h1>
        
        {/* Enhanced search bar */}
        <div className="mb-10">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-20 py-4 bg-gray-100 dark:bg-gray-800 border-0 rounded-l-full text-gray-900 dark:text-white focus:ring-2 focus:ring-[#0F1B44] transition-all"
                  placeholder="Search halal products, shops and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4"
                    onClick={() => setSearchQuery('')}
                  >
                    <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      ✕
                    </span>
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-8 bg-[#0F1B44] text-white rounded-r-full hover:bg-[#183080] transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        
        {/* Popular search terms */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#0F1B44]" />
            <h2 className="text-xl font-serif font-bold text-[#0F1B44] dark:text-white">
              Trending Searches
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {popularSearches.map((term, index) => (
              <motion.button
                key={term}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-[#0F1B44] hover:text-white transition-colors text-sm font-medium"
                onClick={() => handlePopularSearchClick(term)}
              >
                {term}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Categories grid */}
        <div className="mb-10">
          <h2 className="text-xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
            Browse by Category
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productCategories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link 
                  to={`/browse?category=${encodeURIComponent(category)}`}
                  className="block bg-gradient-to-br from-[#0F1B44] to-[#183080] rounded-xl p-5 h-full text-white shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="font-medium text-lg mb-1">{category}</h3>
                  <p className="text-sm text-white/70">
                    Explore {category.toLowerCase()}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Recently viewed - simplified version */}
        <div>
          <h2 className="text-xl font-serif font-bold mb-6 text-[#0F1B44] dark:text-white">
            Recently Viewed
          </h2>
          
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Your recently viewed items will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularSearchesPage;
