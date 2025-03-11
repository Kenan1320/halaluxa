
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cart } = useCart();
  
  // Handle scroll for navbar styles
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className="fixed top-0 w-full z-50 transition-all duration-300 bg-white shadow-sm"
      style={{ height: '70px' }}
    >
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-serif font-bold text-[#2A866A]">Haluna</span>
            
            {/* Orange dot */}
            <div className="ml-1">
              <div className="w-8 h-8 bg-[#F4A261] rounded-full"></div>
            </div>
          </Link>
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-6">
          {/* Search Button */}
          <Link to="/search" className="text-gray-500">
            <Search className="h-6 w-6" />
          </Link>
          
          {/* Cart Button */}
          <Link to="/cart" className="text-gray-500 relative">
            <ShoppingCart className="h-6 w-6" />
            {cart.items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#2A866A] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
          </Link>
          
          {/* Menu Button */}
          <button className="text-gray-500">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
