
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation as useLocationContext } from '@/context/LocationContext';
import { useTheme } from '@/context/ThemeContext';
import NearbyShops from '@/components/home/NearbyShops';
import HeroSection from '@/components/home/HeroSection';
import SectionHeader from '@/components/home/SectionHeader';
import { getCategories } from '@/services/shopService';
import { Category } from '@/models/types';
import FlowingCategoryBar from '@/components/home/FlowingCategoryBar';
import FeaturedProducts from '@/components/home/FeaturedProducts';

export default function Home() {
  const { toast } = useToast();
  const { isLocationEnabled, requestLocation } = useLocationContext();
  const { mode } = useTheme();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [toast]);

  // Filter to show only important categories
  const topCategories = categories.filter(cat => 
    ['Online Shops', 'Restaurants', 'Groceries', 'Halal Meat', 'Clothing', 
     'Books', 'Thobes', 'Hijab', 'Gifts', 'Coffee Shops'].includes(cat.name)
  );

  return (
    <div className={`min-h-screen pt-20 ${mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        {!isLoading && topCategories.length > 0 && (
          <div className="mb-8">
            <SectionHeader title="Browse Categories" />
            <FlowingCategoryBar categories={topCategories} />
          </div>
        )}
        
        {!isLocationEnabled && (
          <div className="mb-8">
            <div className={`p-4 rounded-lg ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <p className="text-center">
                Enable location to see shops near you.{' '}
                <button
                  className="text-green-600 hover:underline font-medium"
                  onClick={requestLocation}
                >
                  Enable Now
                </button>
              </p>
            </div>
          </div>
        )}
        
        <div className="mb-8">
          <SectionHeader title="Shops Near You" />
          <NearbyShops />
        </div>
        
        <div className="mb-8">
          <SectionHeader title="Featured Products" />
          <FeaturedProducts />
        </div>
      </div>
    </div>
  );
}
