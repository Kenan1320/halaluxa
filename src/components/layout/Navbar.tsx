
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useShop } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ShoppingCart, User, Menu, MapPin, ChevronDown, Settings } from 'lucide-react';
import { Shop } from '@/types/shop';
import { getShopById } from '@/services/shopService';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const { mainShop, setMainShop } = useShop();
  const isAuthenticated = user !== null && !isLoading;
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  
  useEffect(() => {
    // Load the main shop from localStorage if available
    const loadMainShop = async () => {
      const mainShopId = localStorage.getItem('mainShopId');
      if (mainShopId) {
        try {
          const shop = await getShopById(mainShopId);
          if (shop) {
            setCurrentShop(shop);
            if (setMainShop) setMainShop(shop);
          }
        } catch (error) {
          console.error('Error loading main shop:', error);
        }
      }
    };
    
    if (!currentShop && !mainShop) {
      loadMainShop();
    } else if (mainShop && !currentShop) {
      setCurrentShop(mainShop);
    }
  }, [mainShop, setMainShop, currentShop]);

  return (
    <div className="bg-[#0F1B44]">
      <nav className="text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left side - Logo and menu */}
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-white hover:text-white/80 focus:outline-none">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#0F1B44] text-white border-r border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-white">Halvi</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link to="/shops" className="flex items-center px-4 py-3 rounded-lg hover:bg-[#132054] transition-colors">
                    <span className="text-lg">Select Your Shops</span>
                  </Link>
                  <Link to="/explore" className="flex items-center px-4 py-3 rounded-lg hover:bg-[#132054] transition-colors">
                    <span className="text-lg">Explore</span>
                  </Link>
                  <Link to="/digital-mall" className="flex items-center px-4 py-3 rounded-lg hover:bg-[#132054] transition-colors">
                    <span className="text-lg">Digital Mall</span>
                  </Link>
                  <Link to="/nearby" className="flex items-center px-4 py-3 rounded-lg hover:bg-[#132054] transition-colors">
                    <span className="text-lg">Nearby Shops</span>
                  </Link>
                  
                  {!isAuthenticated ? (
                    <Link to="/login" className="mt-4">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Login
                      </Button>
                    </Link>
                  ) : (
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="bg-transparent text-white hover:bg-[#132054] hover:text-white">Settings</NavigationMenuTrigger>
                          <NavigationMenuContent className="bg-[#0F1B44] text-white border border-gray-800 min-w-[250px]">
                            <ul className="p-2 space-y-1">
                              <li>
                                <Link to="/settings/account" className="block px-4 py-2 hover:bg-[#132054] rounded-md">
                                  <span className="flex items-center">
                                    <User className="mr-2 h-4 w-4" />
                                    Account Settings
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link to="/settings/orders" className="block px-4 py-2 hover:bg-[#132054] rounded-md">
                                  <span className="flex items-center">
                                    <ShoppingCart className="mr-2 h-4 w-4" />
                                    Orders & Shopping
                                  </span>
                                </Link>
                              </li>
                              <li>
                                <Link to="/settings/security" className="block px-4 py-2 hover:bg-[#132054] rounded-md">
                                  <span className="flex items-center">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Security & Privacy
                                  </span>
                                </Link>
                              </li>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="text-xl font-bold text-white italic">
              Halvi
            </Link>
          </div>
          
          {/* Center - Location */}
          <div className="hidden md:flex items-center">
            <button className="flex items-center text-white hover:text-white/80">
              <MapPin className="h-5 w-5 mr-1" />
              <span className="text-sm">New York</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>

          {/* Right side - Main Shop, Cart and Auth */}
          <div className="flex items-center space-x-4">
            {/* Main Shop */}
            {currentShop && (
              <Link 
                to={`/shop/${currentShop.id}`}
                className="relative flex items-center justify-center"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {currentShop.logo || currentShop.cover_image ? (
                    <img 
                      src={currentShop.logo || currentShop.cover_image} 
                      alt={currentShop.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                      {currentShop.name.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>
            )}
            
            {/* Cart icon with orange background */}
            <Link 
              to="/cart" 
              className="relative flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </Link>
            
            {isAuthenticated ? (
              <Link to="/profile" className="flex items-center justify-center">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  {user && user.avatar_url ? (
                    <Avatar className="h-10 w-10 border border-white/20">
                      <AvatarImage src={user.avatar_url} alt={user.name || 'Avatar'} />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-6 w-6 text-white" />
                  )}
                </div>
              </Link>
            ) : (
              <Link 
                to="/login"
                className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
