
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useShopContext } from '@/context/ShopContext';
import { Shop } from '@/types/shop';
import { adaptShopType } from '@/utils/typeAdapters';

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const isAuthenticated = user !== null && !isLoading;
  const { selectedShop, setSelectedShop } = useShopContext();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleShopSelect = (shop: Shop) => {
    // Convert to expected Shop type and set it
    const adaptedShop = adaptShopType(shop, 'types');
    setSelectedShop(adaptedShop);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
          Halvi
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {user && user.avatar_url && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url} alt={user.name || 'Avatar'} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
              )}
              <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {showMobileMenu && (
        <div className="bg-gray-100 dark:bg-gray-700 py-2">
          <div className="container mx-auto px-4 flex flex-col items-center space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
