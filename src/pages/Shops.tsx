
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Store, Search, MapPin, Filter } from 'lucide-react';
import { getAllShops } from '@/services/shopService';
import { useLocation } from '@/context/LocationContext';
import ShopCard from '@/components/shop/ShopCard';

const Shops = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { isLocationEnabled, getNearbyShops } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchShops = async () => {
      setIsLoading(true);
      try {
        if (isLocationEnabled) {
          const nearbyShops = await getNearbyShops();
          setShops(nearbyShops);
        } else {
          const fetchedShops = await getAllShops();
          setShops(fetchedShops);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShops();
  }, [isLocationEnabled, getNearbyShops]);
  
  // Get unique categories from shops
  const categories = ['All', ...new Set(shops.map(shop => shop.category))];
  
  // Filter shops by search query and category
  const filteredShops = shops.filter(shop => {
    const matchesSearch = 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || categoryFilter === 'All' || shop.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">Discover Muslim Businesses</h1>
            <p className="text-haluna-text-light text-lg mb-8 text-center max-w-3xl mx-auto">
              Browse and support Muslim-owned businesses offering a wide range of halal products and services.
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-5xl mx-auto mb-10">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <input
                    type="text"
                    className="pl-12 pr-4 py-3 w-full border rounded-full focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary transition"
                    placeholder="Search for shops and businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Filter className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <select
                    className="pl-12 pr-10 py-3 border rounded-full focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary appearance-none bg-white cursor-pointer transition"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      category !== 'All' && (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      )
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <div className="h-4 w-4 border-t-2 border-r-2 border-haluna-text-light transform rotate-45 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    categoryFilter === category || (category === 'All' && categoryFilter === '')
                      ? 'bg-haluna-primary text-white'
                      : 'bg-gray-100 text-haluna-text-light hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter(category === 'All' ? '' : category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Shops grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-16">
              <Store className="h-16 w-16 text-haluna-text-light mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No shops found</h3>
              <p className="text-haluna-text-light mb-4">
                {shops.length === 0 
                  ? "We don't have any shops registered yet. Check back soon!" 
                  : "Try adjusting your search to find what you're looking for."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredShops.map((shop, index) => (
                <ShopCard key={shop.id} shop={shop} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shops;
