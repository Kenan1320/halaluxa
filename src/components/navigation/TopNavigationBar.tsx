
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoProps {
  src: string;
  alt: string;
}

interface SearchProps {
  placeholder: string;
}

interface CategoryProps {
  placeholder: string;
}

interface PlatformProps {
  placeholder: string;
}

interface NearbyShopItem {
  name: string;
  avatar: string;
}

interface FeatureProductItem {
  name: string;
  price: number;
  image: string;
}

export interface TopNavigationBarProps {
  logo: LogoProps;
  applicationName: string;
  search: SearchProps;
  categories: CategoryProps;
  platform: PlatformProps;
  nearbyShops?: {
    data: NearbyShopItem[];
  };
  featureProducts?: {
    data: FeatureProductItem[];
  };
  useShimmer?: boolean;
  error?: string;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  logo,
  applicationName,
  search,
  categories,
  platform,
  nearbyShops,
  featureProducts,
  useShimmer = false,
  error,
}) => {
  const isMobile = useIsMobile();
  const [currentNearbyShopsPage, setCurrentNearbyShopsPage] = useState(1);
  const [currentFeatureProductsPage, setCurrentFeatureProductsPage] = useState(1);
  const nearbyShopsContainerRef = useRef<HTMLDivElement>(null);
  const featureProductsContainerRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 5;

  const handleNearbyShopsScroll = () => {
    if (nearbyShopsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = nearbyShopsContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 50) {
        setCurrentNearbyShopsPage(prev => prev + 1);
      }
    }
  };

  const handleFeatureProductsScroll = () => {
    if (featureProductsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = featureProductsContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 50) {
        setCurrentFeatureProductsPage(prev => prev + 1);
      }
    }
  };

  const scrollNearbyShopsLeft = () => {
    if (nearbyShopsContainerRef.current) {
      nearbyShopsContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollNearbyShopsRight = () => {
    if (nearbyShopsContainerRef.current) {
      nearbyShopsContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const scrollFeatureProductsLeft = () => {
    if (featureProductsContainerRef.current) {
      featureProductsContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollFeatureProductsRight = () => {
    if (featureProductsContainerRef.current) {
      featureProductsContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const nearbyShopsContainer = nearbyShopsContainerRef.current;
    const featureProductsContainer = featureProductsContainerRef.current;

    if (nearbyShopsContainer) {
      nearbyShopsContainer.addEventListener('scroll', handleNearbyShopsScroll);
    }

    if (featureProductsContainer) {
      featureProductsContainer.addEventListener('scroll', handleFeatureProductsScroll);
    }

    return () => {
      if (nearbyShopsContainer) {
        nearbyShopsContainer.removeEventListener('scroll', handleNearbyShopsScroll);
      }
      if (featureProductsContainer) {
        featureProductsContainer.removeEventListener('scroll', handleFeatureProductsScroll);
      }
    };
  }, []);

  // Render shimmer loading UI for shops
  const renderShopShimmers = () => (
    Array(itemsPerPage).fill(0).map((_, index) => (
      <div key={`shop-shimmer-${index}`} className="flex flex-col items-center mx-2 min-w-[100px]">
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-2"></div>
        <div className="w-20 h-4 rounded bg-gray-200 animate-pulse"></div>
      </div>
    ))
  );

  // Render shimmer loading UI for products
  const renderProductShimmers = () => (
    Array(itemsPerPage).fill(0).map((_, index) => (
      <div key={`product-shimmer-${index}`} className="flex flex-col mx-2 min-w-[150px]">
        <div className="w-32 h-32 rounded bg-gray-200 animate-pulse mb-2"></div>
        <div className="w-24 h-4 rounded bg-gray-200 animate-pulse mb-1"></div>
        <div className="w-16 h-4 rounded bg-gray-200 animate-pulse"></div>
      </div>
    ))
  );

  return (
    <div className="w-full flex flex-col">
      {/* Top Navigation Bar */}
      <div className="w-full flex items-center justify-between py-3 px-4 border-b">
        {/* Left: Logo */}
        <div className="flex items-center">
          <img src={logo.src} alt={logo.alt} className="h-8 w-auto" />
          {!isMobile && (
            <h1 className="ml-4 font-semibold text-lg">{applicationName}</h1>
          )}
        </div>

        {/* Center: Application Name (on mobile) */}
        {isMobile && (
          <h1 className="font-semibold text-lg">{applicationName}</h1>
        )}
        
        {/* Right: Search, Categories, Platform */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="hidden md:flex items-center">
            <Search className="h-4 w-4 mr-1" />
            {search.placeholder}
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex items-center">
            {categories.placeholder}
          </Button>
          <Button variant="default" size="sm" className="flex items-center">
            {platform.placeholder}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 text-red-600 text-center">
          {error}
        </div>
      )}

      {/* Nearby Shops Section */}
      {(nearbyShops?.data || useShimmer) && (
        <div className="my-4 px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg">Nearby Shops</h2>
            <div className="flex space-x-1">
              <button 
                onClick={scrollNearbyShopsLeft}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={scrollNearbyShopsRight}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div 
            ref={nearbyShopsContainerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide max-w-[800px] mx-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {useShimmer ? (
              renderShopShimmers()
            ) : (
              nearbyShops?.data.slice(0, currentNearbyShopsPage * itemsPerPage).map((shop, index) => (
                <div key={`shop-${index}`} className="flex flex-col items-center mx-2 min-w-[100px]">
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                    <img src={shop.avatar} alt={shop.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium text-center">{shop.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Feature Products Section */}
      {(featureProducts?.data || useShimmer) && (
        <div className="my-4 px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg">Featured Products</h2>
            <div className="flex space-x-1">
              <button 
                onClick={scrollFeatureProductsLeft}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={scrollFeatureProductsRight}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div 
            ref={featureProductsContainerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide max-w-[800px] mx-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {useShimmer ? (
              renderProductShimmers()
            ) : (
              featureProducts?.data.slice(0, currentFeatureProductsPage * itemsPerPage).map((product, index) => (
                <div key={`product-${index}`} className="flex flex-col mx-2 min-w-[150px]">
                  <div className="w-32 h-32 rounded overflow-hidden mb-2">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="text-sm text-green-600 font-semibold">${product.price.toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
