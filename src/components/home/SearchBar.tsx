
import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

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
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`flex items-center rounded-full ${
        mode === 'dark' 
          ? 'bg-gray-800 text-white border border-gray-700' 
          : 'bg-white/90 text-gray-700 border border-white/30'
      } px-4 py-2 shadow-sm`}>
        <Search className="w-5 h-5 mr-2 text-gray-400" />
        <input
          type="text"
          placeholder="Halvi: Explore Your Halal Village"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full outline-none ${
            mode === 'dark' ? 'bg-gray-800 text-white' : 'bg-transparent'
          } text-sm font-medium`}
          style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
        />
      </div>
    </form>
  );
};

export default SearchBar;
