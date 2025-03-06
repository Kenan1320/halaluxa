
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, Home, Store } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { translate } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { cart } = useCart();
  
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
  
  // Define navigation items (moved from bottom navigation)
  const navItems = [
    {
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
      path: '/',
      match: ['/']
    },
    {
      label: 'Shops',
      icon: <Store className="h-5 w-5" />,
      path: '/shops',
      match: ['/shops', '/shop', '/shop/']
    },
    {
      label: 'Browse',
      icon: <Search className="h-5 w-5" />,
      path: '/browse',
      match: ['/browse', '/browse/']
    },
    {
      label: 'Account',
      icon: <User className="h-5 w-5" />,
      path: isLoggedIn ? '/profile' : '/login',
      match: ['/profile', '/login', '/signup']
    }
  ];

  // Filter out cart for business users if needed (fixed the hideForBusiness error)
  const filteredNavItems = user?.role === 'business' 
    ? navItems.filter(item => item.label !== 'Cart') 
    : navItems;

  const isActive = (item: typeof navItems[0]) => {
    return item.match.includes(location.pathname);
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
  
  // Get current hour to determine greeting
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }
  
  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-3'
      } shadow-md bg-[#2A866A]`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Menu and Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white hover:bg-[#2A866A]/80 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <motion.span 
                className="text-2xl font-serif font-bold flex text-white"
                variants={letterVariants}
                initial="initial"
                animate="animate"
              >
                {Array.from("Haluna").map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterChildVariants}
                    style={{ display: 'inline-block' }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
              
              {/* Enhanced logo design with pulsing ball */}
              <div className="relative ml-1">
                <motion.div 
                  className="w-6 h-6 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full shadow-md"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </div>
            </div>
          </Link>
        </div>
        
        {/* Greeting for logged in users */}
        <div className="hidden md:flex items-center">
          <p className="text-white text-sm">
            {greeting}, {isLoggedIn && user ? user.name : 'Guest'}
          </p>
        </div>
        
        {/* Search Bar - Medium and up screens */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search your shop and products"
              className="w-full py-2 px-4 pl-10 bg-white border border-[#2A866A]/20 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2A866A]/30"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2A866A]" />
          </div>
        </div>
        
        {/* Cart and User - always visible */}
        <div className="flex items-center gap-3">
          <Link 
            to={isLoggedIn && user?.role !== 'business' ? '/cart' : '/login'} 
            className="relative p-2 rounded-full hover:bg-[#2A866A]/80"
          >
            <ShoppingCart className="h-6 w-6 text-white" />
            {cart.items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.items.length}
              </span>
            )}
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
                className="w-full py-2 px-4 pl-10 bg-[#2A866A]/10 border border-[#2A866A]/20 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2A866A]/30"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#2A866A]" />
            </div>
          </div>
          
          <nav className="grid grid-cols-1 gap-3">
            {filteredNavItems.map((item) => {
              const active = isActive(item);
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    active ? 'bg-[#2A866A]/10 text-[#2A866A]' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={active ? 'text-[#2A866A]' : 'text-gray-500'}>
                    {item.icon}
                  </span>
                  <span className={active ? 'font-medium' : ''}>
                    {translate(item.label)}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
