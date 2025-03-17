
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MainShopSelector() {
  const navigate = useNavigate();
  const { mainShop } = useShop();
  const [isPulsing, setIsPulsing] = useState(!mainShop);
  
  // Disable pulsing after a while if the user doesn't interact
  useEffect(() => {
    if (!mainShop) {
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 10000); // Stop pulsing after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [mainShop]);
  
  const handleSelectShop = () => {
    navigate('/select-shops');
  };
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSelectShop}
        className="flex items-center gap-2 relative"
      >
        {mainShop ? (
          <>
            {mainShop.logo_url ? (
              <img 
                src={mainShop.logo_url} 
                alt={mainShop.name} 
                className="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {mainShop.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <span className="hidden md:inline text-sm">{mainShop.name}</span>
          </>
        ) : (
          <>
            <div className="relative">
              <Store className="w-5 h-5" />
              {isPulsing && (
                <span className={cn(
                  "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500",
                  "animate-ping opacity-75"
                )}></span>
                
              )}
              <span className={cn(
                "absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500",
                isPulsing ? "opacity-100" : "opacity-0 transition-opacity duration-300"
              )}></span>
            </div>
            <span className="hidden md:inline text-sm">Select Shop</span>
          </>
        )}
      </Button>
    </div>
  );
}
