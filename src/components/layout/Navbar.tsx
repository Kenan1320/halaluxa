import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react';
import { Button } from '../ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center"
        >
          <h1 className="text-haluna-primary text-3xl font-serif">Haluna</h1>
          <span className="ml-1 h-3 w-3 rounded-full bg-haluna-accent inline-block mt-1"></span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-haluna-text hover:text-haluna-primary transition-colors ${
              location.pathname === '/' ? 'font-medium text-haluna-primary' : ''
            }`}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className={`text-haluna-text hover:text-haluna-primary transition-colors ${
              location.pathname === '/shop' ? 'font-medium text-haluna-primary' : ''
            }`}
          >
            Shop
          </Link>
          <Link 
            to="/sellers" 
            className={`text-haluna-text hover:text-haluna-primary transition-colors ${
              location.pathname === '/sellers' ? 'font-medium text-haluna-primary' : ''
            }`}
          >
            Sellers
          </Link>
          <Link 
            to="/about" 
            className={`text-haluna-text hover:text-haluna-primary transition-colors ${
              location.pathname === '/about' ? 'font-medium text-haluna-primary' : ''
            }`}
          >
            About
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <button 
            className="p-2 rounded-full hover:bg-haluna-primary-light transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-haluna-text" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-haluna-primary-light transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={20} className="text-haluna-text" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-haluna-primary-light transition-colors"
            aria-label="Account"
          >
            <User size={20} className="text-haluna-text" />
          </button>
        </div>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden p-2 rounded-full bg-haluna-secondary"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X size={24} className="text-haluna-text" />
          ) : (
            <Menu size={24} className="text-haluna-text" />
          )}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 animate-slide-in-right md:hidden">
          <div className="container mx-auto px-6 py-8 space-y-8">
            <Link 
              to="/" 
              className="block text-xl font-medium p-3 hover:bg-haluna-secondary rounded-md transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="block text-xl font-medium p-3 hover:bg-haluna-secondary rounded-md transition-colors"
            >
              Shop
            </Link>
            <Link 
              to="/sellers" 
              className="block text-xl font-medium p-3 hover:bg-haluna-secondary rounded-md transition-colors"
            >
              Sellers
            </Link>
            <Link 
              to="/about" 
              className="block text-xl font-medium p-3 hover:bg-haluna-secondary rounded-md transition-colors"
            >
              About
            </Link>
            
            <div className="pt-6 mt-6 border-t border-gray-100">
              <p className="text-haluna-text-light mb-4">A curated marketplace connecting Muslim artisans and shoppers through beautiful, ethically sourced products.</p>
              
              <div className="flex flex-col space-y-4 mt-8">
                <Button 
                  href="/shop" 
                  className="w-full justify-center"
                >
                  Shop Now
                </Button>
                <Button 
                  href="/sellers" 
                  variant="outline" 
                  className="w-full justify-center"
                >
                  Become a Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
