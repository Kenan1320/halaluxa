import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, Search, MoreHorizontal, Clock, Users, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopDetails } from '@/types/shop';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface ShopHeaderProps {
  shop: ShopDetails;
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  const navigate = useNavigate();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const menuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sample categories for this shop
  const shopCategories = shop.categories && shop.categories.length > 0
    ? shop.categories
    : [
        { id: '1', name: 'Popular Items', count: 0 },
        { id: '2', name: 'Appetizers', count: 0 },
        { id: '3', name: 'Main Courses', count: 0 },
        { id: '4', name: 'Desserts', count: 0 },
        { id: '5', name: 'Beverages', count: 0 },
      ];

  return (
    <div className={`sticky top-0 z-50 ${isDark ? 'bg-[#1C2526]' : 'bg-background'}`}>
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={shop.cover_image || '/placeholder.svg'} 
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1B44]/70 to-[#0F1B44]/90" />
        
        {/* Top Navigation */}
        <div className="absolute top-0 w-full p-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4">
            <button className="text-white">
              <Search className="h-6 w-6" />
            </button>
            <button className="text-white">
              <Heart className="h-6 w-6" />
            </button>
            <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Menu Button for Category Navigation */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20" 
            onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Shop Logo & Info - Centered */}
        <div className="absolute bottom-0 inset-x-0 flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-white p-1 mb-2">
            <img 
              src={shop.logo_url || '/placeholder.svg'} 
              alt={shop.name} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span>⭐ {shop.rating?.average || shop.rating || 0}</span>
              <span>•</span>
              <span>({shop.rating?.count || '0'}+ ratings)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Toggle
              pressed={deliveryMode === 'delivery'}
              onPressedChange={() => setDeliveryMode('delivery')}
              className={cn(
                "rounded-full px-4",
                deliveryMode === 'delivery' 
                  ? "bg-primary text-white" 
                  : isDark ? "bg-gray-800 text-gray-300" : "bg-secondary"
              )}
            >
              Delivery
            </Toggle>
            <Toggle
              pressed={deliveryMode === 'pickup'}
              onPressedChange={() => setDeliveryMode('pickup')}
              className={cn(
                "rounded-full px-4",
                deliveryMode === 'pickup' 
                  ? "bg-primary text-white" 
                  : isDark ? "bg-gray-800 text-gray-300" : "bg-secondary"
              )}
            >
              Pickup
            </Toggle>
          </div>
          {(shop.isGroupOrderEnabled === true) && (
            <Button 
              variant="outline" 
              className={`rounded-full gap-2 ${
                isDark ? 'border-gray-700 hover:bg-gray-800' : ''
              }`}
            >
              <Users className="h-4 w-4" />
              Group order
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-card'
          }`}>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>
              ${deliveryMode === 'delivery' ? 
                shop.deliveryInfo?.deliveryFee.toFixed(2) || '0.00' : 
                '0.00'}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
              {deliveryMode === 'delivery' ? 'Delivery fee' : 'No fee for pickup'}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-card'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>
                {shop.deliveryInfo?.estimatedTime || '15-25 min'}
              </p>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>Earliest arrival</p>
          </div>
        </div>
        
        {/* Shop-specific search */}
        <div className="mt-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input 
              type="text" 
              placeholder={`Search ${shop.name}`}
              className={`w-full h-12 pl-10 pr-4 rounded-full placeholder:text-gray-400 ${
                isDark 
                  ? 'bg-gray-800 text-white border border-gray-700 focus:border-primary focus:outline-none' 
                  : 'bg-secondary text-foreground'
              }`}
            />
          </div>
        </div>
      </div>
      
      {/* Uber-inspired category menu sidebar (conditionally rendered) */}
      <AnimatePresence>
        {categoryMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="fixed inset-0 bg-black/60 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCategoryMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div 
              ref={categoryMenuRef}
              className={`fixed left-0 top-0 h-full w-[280px] ${
                isDark ? 'bg-[#1C2526]' : 'bg-white'
              } z-50 shadow-xl overflow-y-auto`}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => setCategoryMenuOpen(false)} 
                  className={`p-2 rounded-full ${isDark ? 'text-white' : 'text-black'}`}
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  Categories
                </h2>
                <div className="w-9"></div> {/* Spacer for alignment */}
              </div>
              
              <div className="py-2">
                {shopCategories.map((category) => (
                  <motion.a
                    key={category.id}
                    href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`block px-6 py-3 ${isDark ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'}`}
                    whileTap={{ backgroundColor: isDark ? '#333' : '#f0f0f0' }}
                    onClick={() => setCategoryMenuOpen(false)}
                  >
                    {category.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* More options menu (conditionally rendered) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            ref={menuRef}
            className={`absolute right-0 top-16 shadow-lg rounded-lg overflow-hidden z-50 w-64 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-card'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-2">
              <li className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-secondary/50'
              }`}>
                <Users className="h-5 w-5 text-primary" />
                <span className={isDark ? 'text-white' : ''}>Start group order</span>
              </li>
              <li className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-secondary/50'
              }`}>
                <Heart className="h-5 w-5 text-primary" />
                <span className={isDark ? 'text-white' : ''}>Add to favorites</span>
              </li>
              <li className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors border-t ${
                isDark ? 'border-gray-700 hover:bg-gray-700' : 'hover:bg-secondary/50'
              }`}>
                <span className="h-5 w-5 flex items-center justify-center text-primary">ℹ️</span>
                <span className={isDark ? 'text-white' : ''}>Shop info</span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
