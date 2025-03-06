
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/navigation/BottomNav';
import NearbyShopsSection from '@/components/home/NearbyShopsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection';
import { MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const { isLocationEnabled, location, requestLocation } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header with full-width blue background */}
      <div className="w-full bg-haluna-primary py-3 px-4 fixed top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-white font-semibold text-lg">
              {isLoggedIn ? `Hi, ${user?.name?.split(' ')[0] || 'there'}` : 'Welcome'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={requestLocation}
              className="flex items-center text-white"
            >
              <MapPin className="h-5 w-5 mr-1" />
              <span className="text-sm">
                {isLocationEnabled && location ? location.city : 'Set location'}
              </span>
            </button>
            
            <Link to="/cart" className="relative">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H5.62L8.5 15H18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 7H20L18 13H8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="absolute -top-1 -right-1 bg-white text-haluna-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">0</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="w-full bg-haluna-primary pb-3 px-4 pt-14 fixed z-40">
        <div className="container mx-auto">
          <div className="relative w-full">
            <Link to="/search" className="flex items-center w-full bg-white rounded-full pl-4 pr-3 py-2.5 shadow-sm">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-400">Search Haluna</span>
            </Link>
          </div>
        </div>
      </div>
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Nearby Shops Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-4 text-haluna-primary">Nearby Shops</h2>
            <NearbyShopsSection />
          </section>

          {/* Categories Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold text-haluna-primary">Browse by Category</h2>
              <Link to="/browse" className="text-haluna-primary text-sm font-medium">See all</Link>
            </div>
            <CategoriesSection />
          </section>
          
          {/* Featured Products Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-bold text-haluna-primary">Featured Products</h2>
              <Link to="/browse" className="text-haluna-primary text-sm font-medium">See all</Link>
            </div>
            <FeaturedProductsSection />
          </section>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Index;
