
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const navigate = useNavigate();
  const { mode } = useTheme();

  const placeholders = [
    "Search The Hal Village with Halvi",
    "From Local Finds to Global Treasures!",
    "Your Halal Village, All in One Place"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholders.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex items-center rounded-full shadow-md hover:shadow-lg transition-all duration-300 px-6 py-4 ${
        mode === 'dark' 
          ? 'bg-gray-800 text-white border border-gray-700' 
          : 'bg-white text-gray-700 border border-gray-200'
      }`}>
        <Search className="w-6 h-6 mr-4 text-gray-400" />
        <div className="relative w-full h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.input
              key={placeholderIndex}
              type="text"
              placeholder={placeholders[placeholderIndex]}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full outline-none ${
                mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
              } text-base font-medium`}
              style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
