
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getNearbyShops } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopCard from '@/components/shop/ShopCard';

const NearbyShops = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLocationEnabled, location } = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadShops = async () => {
      try {
        setIsLoading(true);
        const nearbyShops = await getNearbyShops();
        setShops(nearbyShops);
      } catch (error) {
        console.error('Error loading nearby shops:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isLocationEnabled && location) {
      loadShops();
    } else {
      // Load anyway for demo purposes
      loadShops();
    }
  }, [isLocationEnabled, location]);
  
  // Auto-scroll animation
  useEffect(() => {
    if (!containerRef.current || shops.length === 0) return;
    
    let animationId: number;
    let position = 0;
    
    const animate = () => {
      if (!containerRef.current) return;
      
      position += 0.4;
      if (position >= containerRef.current.scrollWidth - containerRef.current.clientWidth) {
        position = 0;
      }
      
      containerRef.current.scrollLeft = position;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    const container = containerRef.current;
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };
    
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      cancelAnimationFrame(animationId);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [shops]);
  
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-lg">
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex-shrink-0 w-64 h-56 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  
  if (!shops.length) {
    return null;
  }
  
  // Duplicate shops array to create continuous flow
  const duplicatedShops = [...shops, ...shops];
  
  return (
    <div className="overflow-hidden relative rounded-lg">
      {/* Gradient overlays for smooth scroll transition */}
      <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicatedShops.map((shop, index) => (
          <motion.div 
            key={`${shop.id}-${index}`}
            className="flex-shrink-0 w-64 relative"
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="absolute inset-0 rounded-lg opacity-10 z-0"
              animate={{
                background: [
                  'linear-gradient(45deg, #2A866A, #E4F5F0)',
                  'linear-gradient(135deg, #E4F5F0, #2A866A)',
                  'linear-gradient(225deg, #2A866A, #E4F5F0)',
                  'linear-gradient(315deg, #E4F5F0, #2A866A)'
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <ShopCard shop={shop} index={index} minimal={true} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NearbyShops;
