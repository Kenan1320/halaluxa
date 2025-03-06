
import { Home, Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 flex justify-between items-center z-50"
    >
      <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-haluna-primary' : 'text-gray-500'}`}>
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link to="/search" className={`flex flex-col items-center ${isActive('/search') ? 'text-haluna-primary' : 'text-gray-500'}`}>
        <Search className="h-6 w-6" />
        <span className="text-xs mt-1">Search</span>
      </Link>
      
      <Link to="/cart" className={`flex flex-col items-center ${isActive('/cart') ? 'text-haluna-primary' : 'text-gray-500'}`}>
        <ShoppingCart className="h-6 w-6" />
        <span className="text-xs mt-1">Cart</span>
      </Link>
      
      <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-haluna-primary' : 'text-gray-500'}`}>
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
      
      <Link to="/menu" className={`flex flex-col items-center ${isActive('/menu') ? 'text-haluna-primary' : 'text-gray-500'}`}>
        <Menu className="h-6 w-6" />
        <span className="text-xs mt-1">Menu</span>
      </Link>
    </motion.nav>
  );
};

export default BottomNav;
