
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fetchAllShops } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopProductList from '@/components/shop/ShopProductList';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Shop } from '@/models/shop';
import { useQuery } from '@tanstack/react-query';

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const { theme } = useTheme();
  const shopLogosRef = useRef<HTMLDivElement>(null);
  
  // Use React Query to fetch shops
  const { data: fetchedShops, isLoading, error } = useQuery({
    queryKey: ['shops'],
    queryFn: fetchAllShops,
    onSuccess: (data) => {
      setShops(data);
    }
  });
  
  // Infinite auto-scrolling for shop logos
  useEffect(() => {
    const logoContainer = shopLogosRef.current;
    if (!logoContainer || shops.length === 0) return;

    let scrollAmount = 0;
    let scrollDirection = 1;
    let animationId: number;
    let isPaused = false;

    const scrollSpeed = 0.5; // Adjust speed as needed

    const autoScroll = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }

      if (logoContainer) {
        scrollAmount += scrollSpeed * scrollDirection;
        logoContainer.scrollLeft = scrollAmount;

        // Check if we've scrolled to the end, reset to beginning
        if (scrollAmount >= logoContainer.scrollWidth - logoContainer.clientWidth) {
          // Instead of reversing, reset to beginning with a small delay
          setTimeout(() => {
            scrollAmount = 0;
            logoContainer.scrollLeft = 0;
          }, 500);
        }
      }

      animationId = requestAnimationFrame(autoScroll);
    };

    // Start auto-scrolling
    animationId = requestAnimationFrame(autoScroll);

    // Add pause/resume on user interaction
    const handlePause = () => { isPaused = true; };
    const handleResume = () => { isPaused = false; };
    
    logoContainer.addEventListener('mouseenter', handlePause);
    logoContainer.addEventListener('mouseleave', handleResume);
    logoContainer.addEventListener('touchstart', handlePause);
    logoContainer.addEventListener('touchend', handleResume);

    return () => {
      cancelAnimationFrame(animationId);
      logoContainer.removeEventListener('mouseenter', handlePause);
      logoContainer.removeEventListener('mouseleave', handleResume);
      logoContainer.removeEventListener('touchstart', handlePause);
      logoContainer.removeEventListener('touchend', handleResume);
    };
  }, [shops]);
  
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-64 h-56 bg-muted rounded-lg animate-pulse dark:bg-muted/50"
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (!shops.length) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      {/* Shop logos flowing horizontally with infinite scroll */}
      <div className="mb-8 overflow-hidden">
        <div 
          ref={shopLogosRef}
          className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Duplicate shops to create an illusion of infinite scrolling */}
          {[...shops, ...shops].map((shop, index) => (
            <Link to={`/shop/${shop.id}`} key={`${shop.id}-${index}`}>
              <motion.div 
                className="flex-shrink-0 flex flex-col items-center justify-center"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: theme === 'dark' ? '0 0 10px rgba(209, 232, 226, 0.2)' : '0 4px 12px rgba(0,0,0,0.1)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-card shadow-sm mb-2">
                  {shop.logo_url ? (
                    <img 
                      src={shop.logo_url} 
                      alt={`${shop.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {shop.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-center">{shop.name}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Shop products sections */}
      {shops.map((shop) => (
        <div key={shop.id} className="mb-8">
          {/* Shop header with name and logo - now animated and clickable */}
          <Link to={`/shop/${shop.id}`} className="group flex items-center gap-3 mb-4">
            <motion.div 
              className="w-10 h-10 rounded-full overflow-hidden bg-card shadow-sm flex items-center justify-center dark:shadow-md dark:shadow-primary/5"
              whileHover={{ 
                scale: 1.1,
                boxShadow: theme === 'dark' ? '0 0 10px rgba(209, 232, 226, 0.2)' : '0 4px 12px rgba(0,0,0,0.1)'
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {shop.logo_url ? (
                <img 
                  src={shop.logo_url} 
                  alt={`${shop.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center dark:bg-primary/20">
                  <span className="text-xs font-medium text-primary">
                    {shop.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
            </motion.div>
            <motion.h3 
              className="text-base font-medium relative"
              whileHover={{ color: "hsl(var(--primary))" }}
            >
              {shop.name}
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.h3>
          </Link>
          
          {/* Shop products in horizontal scroll */}
          <ShopProductList shopId={shop.id} horizontal={true} />
        </div>
      ))}
    </div>
  );
};

export default NearbyShops;
