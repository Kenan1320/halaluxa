
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search products, shops, and more...",
  className = "",
  onSearch 
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { mode } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <motion.div 
        className={`flex items-center rounded-xl ${
          mode === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-gray-100 border border-gray-200'
        } px-4 py-3`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Search className="h-5 w-5 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full outline-none text-sm ${
            mode === 'dark' ? 'bg-gray-800 text-white placeholder:text-gray-500' : 'bg-gray-100 text-gray-800 placeholder:text-gray-500'
          }`}
        />
      </motion.div>
    </form>
  );
};

export default SearchBar;
