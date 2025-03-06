
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Store, MapPin, Search, Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';
import AuthNavItems from './AuthNavItems';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, translate } = useLanguage();
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
  
  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="text-2xl font-serif font-bold text-haluna-primary">Haluna</span>
            {/* Enhanced logo design with more sophisticated styling */}
            <div className="relative ml-1">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-md"></div>
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white rounded-full opacity-40"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-haluna-primary rounded-full animate-pulse"></div>
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
                  className={`text-haluna-text hover:text-haluna-primary transition whitespace-nowrap ${
                    link.href === '/sellers' ? 'text-sm' : ''
                  } ${
                    location.pathname === link.href ? 'font-medium text-haluna-primary' : ''
                  }`}
                >
                  {translate(link.label)}
                </Link>
              ))}
            </nav>
            
            <button 
              onClick={toggleLanguage} 
              className="p-2 rounded-full hover:bg-haluna-primary-light transition flex items-center gap-1 text-haluna-text"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
            
            <AuthNavItems />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage} 
              className="p-2 rounded-full hover:bg-haluna-primary-light transition"
            >
              <Globe className="h-4 w-4 text-haluna-text" />
            </button>
            
            <AuthNavItems />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-haluna-text hover:bg-haluna-primary-light transition"
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
        <div className="container mx-auto px-4 py-4 bg-white border-t">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-haluna-text hover:text-haluna-primary transition py-2 ${
                  location.pathname === link.href ? 'font-medium text-haluna-primary' : ''
                }`}
              >
                {translate(link.label)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
