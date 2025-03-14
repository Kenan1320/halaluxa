
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
    "Search products, shops and more...",
    "Find halal products with Halvi",
    "What are you looking for today?"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prevIndex => (prevIndex + 1) % placeholders.length);
    }, 5000);

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
      <div className={`flex items-center rounded-full ${
        mode === 'dark' 
          ? 'bg-gray-800 text-white border border-gray-700' 
          : 'bg-white text-gray-700 border border-gray-200'
      } px-4 py-3 shadow-sm hover:shadow-md transition-all duration-300`}>
        <Search className="w-5 h-5 mr-3 text-gray-400" />
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
              } text-base`}
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
