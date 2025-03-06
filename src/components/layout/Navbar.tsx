import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { translate } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { cart } = useCart();
  const { isLocationEnabled, requestLocation, location: userLocation } = useLocationContext();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  // Handle scroll for navbar styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Filter out cart for business users if needed
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Animation variants for the logo text
  const letterVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const letterChildVariants = {
    initial: { color: "#2A866A" },
    animate: { 
      color: ["#2A866A", "#3A9E7E", "#2F9173", "#1F7A5C", "#2A866A"],
      transition: { 
        duration: 8, 
        repeat: Infinity,
        repeatType: "reverse" as const
      } 
    }
  };
  
  return (
    <header 
      className="fixed top-0 w-full z-50 transition-all duration-300 bg-[#E4F5F0]"
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#2A866A]"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Logo with animated balls */}
        <Link to="/" className="absolute left-16 transform -translate-x-1/2">
          <div className="flex items-center">
            <span className="text-2xl font-serif font-bold text-[#2A866A]">Haluna</span>
            
            {/* Enhanced logo design with pulsing ball */}
            <div className="relative ml-1">
              <motion.div 
                className="w-8 h-8 bg-[#FF7A45] rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div
                className="w-3 h-3 bg-[#2A866A] rounded-full absolute -bottom-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              />
            </div>
          </div>
        </Link>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Location Button */}
          <button 
            onClick={requestLocation}
            className="p-2 rounded-full text-[#2A866A] hover:bg-[#d5efe8] transition-colors"
          >
            <MapPin className="h-6 w-6" />
          </button>
          
          {/* Cart Button */}
          <Link 
            to="/cart" 
            className="relative p-2 rounded-lg bg-[#FF7A45] text-white"
          >
            <ShoppingCart className="h-6 w-6" />
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#2A866A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </Link>
          
          {/* User Profile */}
          <Link
            to={isLoggedIn ? '/profile' : '/login'}
            className="p-2 rounded-full bg-[#2A866A] text-white"
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="container mx-auto px-4 py-4 bg-white border-t border-gray-100">
          <div className="md:hidden mb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search your shop and products"
                className="w-full py-2 px-4 pl-10 bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A866A]/30"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <nav className="grid grid-cols-1 gap-3">
            <Link
              to="/"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/') ? 'bg-[#E4F5F0] text-[#2A866A]' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Home</span>
            </Link>
            <Link
              to="/shops"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/shops') ? 'bg-[#E4F5F0] text-[#2A866A]' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Shops</span>
            </Link>
            <Link
              to="/browse"
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/browse') ? 'bg-[#E4F5F0] text-[#2A866A]' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Browse</span>
            </Link>
            <Link
              to={isLoggedIn ? '/profile' : '/login'}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive('/profile') || isActive('/login') ? 'bg-[#E4F5F0] text-[#2A866A]' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{isLoggedIn ? 'My Account' : 'Sign In'}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
