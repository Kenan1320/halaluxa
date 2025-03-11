import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { fetchAllShops } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopProductList from '@/components/shop/ShopProductList';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Shop } from '@/models/shop';
import { useQuery } from '@tanstack/react-query';
import { CarIcon, Store, MapPin } from 'lucide-react';

const NearbyShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [nearbyCity, setNearbyCity] = useState<string>("your area");
  const [pickupMethod, setPickupMethod] = useState<string | null>(null);
  const [showPickupOptions, setShowPickupOptions] = useState(false);
  const { isLocationEnabled, location, getNearbyShops } = useLocation();
  const { theme } = useTheme();
  const shopLogosRef = useRef<HTMLDivElement>(null);
  
  // Use React Query to fetch shops
  const { data: fetchedShops, isLoading, error } = useQuery({
    queryKey: ['shops'],
    queryFn: fetchAllShops
  });
  
  // Update local state when data is fetched and apply user preferences
  useEffect(() => {
    if (fetchedShops) {
      setShops(fetchedShops);
      
      // Try to get user's selected shops from localStorage
      const selectedShopsJson = localStorage.getItem('selectedShops');
      let userSelectedShops: string[] = [];
      
      if (selectedShopsJson) {
        try {
          userSelectedShops = JSON.parse(selectedShopsJson);
        } catch (e) {
          console.error("Error parsing selected shops:", e);
        }
      }
      
      // If user has selected shops, filter the displayed shops
      if (userSelectedShops.length > 0) {
        const filtered = fetchedShops.filter(shop => userSelectedShops.includes(shop.id));
        setFilteredShops(filtered.length > 0 ? filtered : fetchedShops);
      } else {
        // Otherwise show all shops
        setFilteredShops(fetchedShops);
      }
    }
  }, [fetchedShops]);
  
  // Load nearby city and pickup preference
  useEffect(() => {
    if (location?.city) {
      setNearbyCity(location.city);
    }
    
    const savedPickupMethod = localStorage.getItem('pickupMethod');
    if (savedPickupMethod) {
      setPickupMethod(savedPickupMethod);
    }
  }, [location]);
  
  // Set pickup method
  const handlePickupMethodSelect = (method: string) => {
    setPickupMethod(method);
    localStorage.setItem('pickupMethod', method);
    setShowPickupOptions(false);
  };
  
  // Enhanced infinite auto-scrolling for shop logos with perspective effect
  useEffect(() => {
    const logoContainer = shopLogosRef.current;
    if (!logoContainer || filteredShops.length === 0) return;

    let scrollAmount = 0;
    let animationId: number;
    let isPaused = false;

    const scrollSpeed = 1.2; // Increased speed as requested

    const autoScroll = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(autoScroll);
        return;
      }

      if (logoContainer) {
        scrollAmount += scrollSpeed;
        logoContainer.scrollLeft = scrollAmount;

        // Check if we've scrolled to the end
        if (scrollAmount >= logoContainer.scrollWidth - logoContainer.clientWidth) {
          // Reset to beginning without stopping
          scrollAmount = 0;
          logoContainer.scrollLeft = 0;
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
  }, [filteredShops]);
  
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
      {/* Location and Pickup Options Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary mr-1" />
          <span>Shops near {nearbyCity}</span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowPickupOptions(!showPickupOptions)}
            className="flex items-center text-sm bg-secondary/70 dark:bg-secondary/40 px-3 py-1.5 rounded-full hover:bg-secondary transition-colors"
          >
            <span className="mr-2">Pickup?</span>
            {pickupMethod ? (
              pickupMethod === 'car' ? (
                <CarIcon className="h-4 w-4 text-primary" />
              ) : (
                <Store className="h-4 w-4 text-primary" />
              )
            ) : null}
          </button>
          
          {showPickupOptions && (
            <div className="absolute right-0 top-10 z-10 bg-card shadow-lg rounded-lg border border-border w-48 overflow-hidden">
              <div className="p-1">
                <button 
                  onClick={() => handlePickupMethodSelect('store')}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-secondary/50 rounded-md transition-colors"
                >
                  <Store className="h-4 w-4 mr-2 text-primary" />
                  <span>Pickup inside store</span>
                </button>
                <button 
                  onClick={() => handlePickupMethodSelect('car')}
                  className="flex items-center w-full px-3 py-2 text-sm hover:bg-secondary/50 rounded-md transition-colors"
                >
                  <CarIcon className="h-4 w-4 mr-2 text-primary" />
                  <span>Pickup in your car</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Shop logos flowing horizontally with infinite scroll and perspective effect */}
      <div className="mb-8 overflow-hidden">
        <div 
          ref={shopLogosRef}
          className="flex overflow-x-auto gap-8 py-6 px-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Triple the shops for smoother infinite scrolling */}
          {[...filteredShops, ...filteredShops, ...filteredShops].map((shop, index) => (
            <Link to={`/shop/${shop.id}`} key={`${shop.id}-${index}`}>
              <motion.div 
                className="flex-shrink-0 flex flex-col items-center justify-center perspective-effect"
                initial={{ scale: index % filteredShops.length === Math.floor(filteredShops.length / 2) ? 1.1 : 0.9 }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: theme === 'dark' ? '0 0 10px rgba(209, 232, 226, 0.2)' : '0 4px 12px rgba(0,0,0,0.1)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  transform: index % filteredShops.length === Math.floor(filteredShops.length / 2) 
                    ? 'scale(1.1) translateZ(20px)' 
                    : 'scale(0.9) translateZ(0px)'
                }}
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
      {filteredShops.map((shop) => (
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
