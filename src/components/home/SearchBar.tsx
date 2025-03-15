
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const searchPhrases = [
  "Search The Hal Village with Halvi",
  "Your Halal Village, All in One Place",
  "Everything Halal, All in One Place",
  "Your Halal Finds Near & Far"
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const navigate = useNavigate();
  const { mode } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % searchPhrases.length);
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
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className={`flex items-center rounded-xl ${
        mode === 'dark' 
          ? 'bg-gray-800/90 text-white border border-gray-700' 
          : 'bg-white/90 text-gray-700 border border-white/30'
      } px-5 py-3 shadow-md transition-all hover:shadow-lg`}>
        <Search className="w-5 h-5 mr-3 text-gray-400" />
        
        <div className="relative flex-1 h-6 overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full outline-none ${
              mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-transparent'
            } text-base font-medium z-10 relative ${query ? 'opacity-100' : 'opacity-0'}`}
            style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
          />
          
          {!query && (
            <div className="absolute inset-0 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-gray-500 text-base font-medium"
                  style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
                >
                  {searchPhrases[phraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
