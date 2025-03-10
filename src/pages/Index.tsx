
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import CategoryScroll from '@/components/home/CategoryScroll';
import NearbyShops from '@/components/home/NearbyShops';
import Stats from '@/components/home/Stats';
import ProductGrid from '@/components/home/ProductGrid';
import LocationBar from '@/components/home/LocationBar';
import SearchBar from '@/components/home/SearchBar';
import WelcomeBanner from '@/components/shop/WelcomeBanner';
import { Shop } from '@/services/shopService';

const Index = () => {
  const { user } = useAuth();
  const { userLocation, shops } = useLocation();
  const [selectedShops, setSelectedShops] = useState<Shop[]>([]);

  // Load user's selected shops
  useEffect(() => {
    const loadSelectedShops = async () => {
      // In a real app, this would fetch the user's preferred shops from the database
      // For now, just use the nearby shops for demonstration
      if (shops && shops.length > 0) {
        setSelectedShops(shops.slice(0, 3));
      }
    };

    if (user) {
      loadSelectedShops();
    }
  }, [user, shops]);

  return (
    <div className="min-h-screen bg-white">
      {/* Welcome Banner if user is logged in */}
      {user && (
        <WelcomeBanner
          userName={user.name || 'there'}
          role={user.role}
        />
      )}

      {/* Hero Section */}
      <Hero />

      {/* Location Bar */}
      <div className="container mx-auto px-4 py-4">
        <LocationBar />
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-4">
        <SearchBar />
      </div>

      {/* Categories */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Browse Categories</h2>
          <CategoryScroll />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8">Popular Products</h2>
          <ProductGrid />
          <div className="text-center mt-8">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-haluna-primary hover:bg-haluna-primary-dark transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Nearby Shops */}
      {userLocation && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-8">Shops Near You</h2>
            <NearbyShops />
            <div className="text-center mt-8">
              <Link
                to="/shops"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-haluna-primary hover:bg-haluna-primary-dark transition-colors"
              >
                See All Shops
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Haluna?</h2>
          <Features />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Growing Community</h2>
          <Stats />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-haluna-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with Muslim-owned businesses and shop with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-haluna-primary rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              to="/shop"
              className="px-8 py-3 bg-transparent border-2 border-white rounded-md font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
