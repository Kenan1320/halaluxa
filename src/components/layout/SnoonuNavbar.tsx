
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Search, Menu, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const SnoonuNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const { mode } = useTheme();
  const location = useLocation();
  const locationContext = useLocationContext();
  const { toast } = useToast();
  
  // Handle scroll for navbar styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const handleLocationClick = () => {
    locationContext.requestLocation();
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      style={{ 
        background: 'linear-gradient(180deg, #0a0a29 0%, #0c0c35 100%)', 
        height: '60px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Left section - Menu and Logo */}
        <div className="flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white p-2"
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="ml-3">
            <div className="text-white font-bold text-2xl">
              Halvi
            </div>
          </Link>
        </div>
        
        {/* Location button */}
        <button 
          onClick={handleLocationClick}
          className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-16 bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-2 text-sm"
        >
          <MapPin size={16} className="text-gray-500" />
          <span className="font-medium">
            {locationContext.location?.city || "Set location"}
          </span>
        </button>
        
        {/* Right section - Login */}
        <div className="flex items-center gap-2">
          <Link to="/cart" className="text-white p-2 relative">
            <ShoppingCart size={24} />
          </Link>
          
          {isLoggedIn ? (
            <Link 
              to="/profile" 
              className="text-white p-2"
            >
              <User size={24} />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="bg-white text-black px-5 py-2 rounded-full font-medium"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      
      {/* Search bar */}
      <form 
        onSubmit={handleSearch} 
        className="absolute top-16 left-0 right-0 px-4"
      >
        <div className="relative rounded-full overflow-hidden shadow-md">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search for stores and products"
            className="w-full pl-12 pr-4 py-3 text-gray-800 bg-white outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>
    </header>
  );
};

export default SnoonuNavbar;
