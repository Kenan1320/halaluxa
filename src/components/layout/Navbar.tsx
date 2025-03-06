
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Store, MapPin, Search } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import AuthNavItems from './AuthNavItems';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { translate } = useLanguage();
  const isMobile = useIsMobile();
  const location = useLocation();
  
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
  
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/browse', label: 'Browse Categories & Shops' },
    { href: '/sellers', label: 'Connect your Shop with your Customers and More' },
    { href: '/about', label: 'About' },
  ];

  // Animation variants for background gradient
  const gradientVariants = {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
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
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      } backdrop-blur-lg shadow-md`}
      variants={gradientVariants}
      animate="animate"
      style={{
        backgroundSize: "300% 300%",
        background: "linear-gradient(-45deg, #E5DEFF 0%, #8cd9a3 25%, #b2f0cb 50%, #E5DEFF 75%, #d6c5ff 100%)"
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <motion.span 
              className="text-2xl font-serif font-bold text-white drop-shadow-sm"
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
            
            {/* Enhanced logo design with animated elements */}
            <div className="relative ml-1">
              <motion.div 
                className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-md"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"
                  animate={{
                    scale: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>
            </div>
          </div>
        </Link>
        
        {!isMobile ? (
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-white hover:text-white/80 transition whitespace-nowrap ${
                    link.href === '/sellers' ? 'text-sm' : ''
                  } ${
                    location.pathname === link.href ? 'font-medium underline decoration-2 underline-offset-4' : ''
                  }`}
                >
                  {translate(link.label)}
                </Link>
              ))}
            </nav>
            
            <AuthNavItems />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <AuthNavItems />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile menu */}
      {isMobile && mobileMenuOpen && (
        <div className="container mx-auto px-4 py-4 bg-green-500/95 backdrop-blur-sm border-t border-white/20">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-white hover:text-white/80 transition py-2 ${
                  location.pathname === link.href ? 'font-medium underline decoration-2 underline-offset-4' : ''
                }`}
              >
                {translate(link.label)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </motion.header>
  );
};

export default Navbar;
