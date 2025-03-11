import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import CategoryScroll from '@/components/home/CategoryScroll';
import NearbyShops from '@/components/home/NearbyShops';
import Features from '@/components/home/Features';
import Stats from '@/components/home/Stats';
import ProductGrid from '@/components/home/ProductGrid';
import LocationBar from '@/components/home/LocationBar';
import { fetchFeaturedProducts } from '@/services/productService';
import { fetchPopularShops } from '@/services/shopService';
import { type Shop } from '@/types/supabase-types';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularShops, setPopularShops] = useState<Shop[]>([]);

  useEffect(() => {
    const getFeaturedProducts = async () => {
      const products = await fetchFeaturedProducts();
      setFeaturedProducts(products);
    };

    const getPopularShops = async () => {
      const shops = await fetchPopularShops();
      setPopularShops(shops);
    };

    getFeaturedProducts();
    getPopularShops();
  }, []);

  return (
    <div>
      <LocationBar />
      <Hero />
      <CategoryScroll />

      <div className="container mx-auto px-4 py-12">
        <NearbyShops />
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ProductGrid products={featuredProducts} />
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Shops</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link to={`/shop/${shop.id}`}>
                <img
                  src={shop.cover_image || shop.logo_url || 'https://via.placeholder.com/400x300'}
                  alt={shop.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{shop.name}</h3>
                  <p className="text-gray-600">{shop.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Features />
      <Stats />
    </div>
  );
};

export default Index;
