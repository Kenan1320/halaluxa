
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { mode } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative">
      <motion.div 
        className={`relative flex items-center rounded-full px-5 py-3.5 shadow-lg ${
          mode === 'dark' 
            ? 'bg-gray-800 text-white border border-gray-700' 
            : 'bg-white text-gray-700 border border-gray-200'
        }`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Search className="w-5 h-5 mr-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search The Hal Village"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full outline-none ${
            mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
          } text-base font-medium tracking-wide`}
          style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
        />
        
        {/* Animated light effect */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none opacity-60"
          style={{ 
            background: mode === 'dark' 
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' 
              : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)'
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </form>
  );
};

export default SearchBar;
