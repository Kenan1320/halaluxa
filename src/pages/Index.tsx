
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useToast } from "@/hooks/use-toast"

import Hero from '@/components/home/Hero';
import FlowingCategories from '@/components/home/FlowingCategories';
import ShopCard from '@/components/shop/ShopCard';
import { getAllShops } from '@/services/shopService';
import { Product } from '@/types/database';
import { getFeaturedProducts } from '@/services/productService';

const Index = () => {
  const { toast } = useToast()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [isLoadingShops, setIsLoadingShops] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products as unknown as Product[]);
      } catch (error) {
        console.error('Error loading featured products:', error);
        toast({
          title: "Error loading products",
          description: "There was an error loading featured products. Please try again later.",
          variant: "destructive",
        })
      }
    };

    loadFeaturedProducts();
  }, []);

  useEffect(() => {
    const loadNearbyShops = async () => {
      try {
        setIsLoadingShops(true);
        const shops = await getAllShops();
        // Fix types by using the Shop type from database
        setNearbyShops(shops as unknown as any);
      } catch (error) {
        console.error('Error loading nearby shops:', error);
        toast({
          title: "Error loading shops",
          description: "There was an error loading nearby shops. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingShops(false);
      }
    };

    loadNearbyShops();
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Halvi - Halal products and services</title>
      </Helmet>

      <div className="mb-16 pb-16">
        <Hero />
        
        {/* FlowingCategories replaces CategoryScroll */}
        <FlowingCategories />
        
        <div className="container px-4 mx-auto max-w-6xl">
          {/* Display featured products here */}
          {featuredProducts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Render product cards here */}
              </div>
            </section>
          )}

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Nearby Halal Shops</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoadingShops ? (
                // Display a skeleton loader while loading
                [...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-40 rounded-lg mb-2"></div>
                    <div className="bg-gray-200 h-6 w-3/4 rounded-md mb-1"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded-md"></div>
                  </div>
                ))
              ) : nearbyShops.length > 0 ? (
                // Display shop cards if shops are available
                nearbyShops.map((shop) => (
                  <ShopCard 
                    key={shop.id} 
                    shop={shop}
                    index={shop.id} // Add index prop to fix type error
                  />
                ))
              ) : (
                // Display a message if no shops are found
                <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center">
                  <p className="text-gray-500">No nearby shops found. Please try again later.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Index;
