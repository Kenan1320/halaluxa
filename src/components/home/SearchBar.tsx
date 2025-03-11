
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import RotatingPlaceholder from '@/components/ui/RotatingPlaceholder';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const navigate = useNavigate();

  const rotatingTexts = [
    "Don't just shop—Halvi it! it's your Halvillage",
    "Are you Halvi-ing your Groceries today?",
    "You can Halvi & visit your online shops"
  ];
  
  const defaultPlaceholder = "Search Halvi: Your Hal Village";
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <form 
      onSubmit={handleSearch}
      className="relative w-full max-w-4xl mx-auto"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-haluna-text-light" />
        </div>
        
        <input
          type="text"
          className="w-full pl-12 pr-16 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-haluna-primary focus:border-transparent transition-all duration-200 shadow-sm"
          placeholder={
            <RotatingPlaceholder
              texts={rotatingTexts}
              defaultText={defaultPlaceholder}
              rotationInterval={3000}
              defaultInterval={30000}
              onChange={setCurrentPlaceholder}
            /> as unknown as string
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              type="button"
              className="absolute inset-y-0 right-14 flex items-center pr-3 text-gray-400"
              onClick={() => setSearchQuery('')}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="sr-only">Clear search</span>
              <svg 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
        
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-4 text-haluna-primary bg-transparent rounded-r-full hover:text-haluna-primary-dark transition-colors duration-200"
        >
          <span className="sr-only">Search</span>
          <svg 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
