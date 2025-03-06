
import { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLocation } from '@/context/LocationContext';
import { getShops } from '@/services/shopService';
import ShopCard from '@/components/shop/ShopCard';

const Browse = () => {
  const { isLocationEnabled, location, requestLocation } = useLocation();
  const routerLocation = useRouterLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Load all shops on mount
  useEffect(() => {
    const loadShops = async () => {
      setIsLoading(true);
      try {
        const allShops = await getShops();
        setShops(allShops);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(allShops.map(shop => shop.category))];
        setCategories(uniqueCategories);
        
        // Initial filtering
        applyFilters(allShops, searchTerm, selectedCategory);
      } catch (error) {
        console.error('Error loading shops:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShops();
  }, []);
  
  // Update search term when URL parameter changes
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    setSearchTerm(searchFromUrl);
    applyFilters(shops, searchFromUrl, selectedCategory);
  }, [searchParams, routerLocation]);
  
  const applyFilters = (shopList, search, category) => {
    let filtered = [...shopList];
    
    // Apply search filter
    if (search) {
      const lowercaseSearch = search.toLowerCase();
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(lowercaseSearch) || 
        shop.description.toLowerCase().includes(lowercaseSearch) ||
        shop.category.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Apply category filter
    if (category) {
      filtered = filtered.filter(shop => shop.category === category);
    }
    
    // Sort by nearby if location is enabled
    if (isLocationEnabled && filtered.length > 0) {
      filtered.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }
    
    setFilteredShops(filtered);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm });
    applyFilters(shops, searchTerm, selectedCategory);
  };
  
  const selectCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
    applyFilters(shops, searchTerm, category === selectedCategory ? '' : category);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSearchParams({});
    applyFilters(shops, '', '');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Browse Muslim-Owned Shops
            </h1>
            <p className="text-haluna-text-light max-w-2xl">
              Discover and support Muslim-owned businesses offering a wide range of halal products and services.
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search shops and businesses..."
                  className="pl-10 w-full border rounded-lg p-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  Search
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                {(searchTerm || selectedCategory) && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={clearFilters}
                    className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </form>
            
            {isFiltersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => selectCategory(category)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedCategory === category
                            ? 'bg-haluna-primary text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  {isLocationEnabled ? (
                    <div className="flex items-center text-sm text-haluna-primary">
                      <MapPin className="h-4 w-4 mr-1" />
                      Showing shops near {location?.city || 'your location'}
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={requestLocation}
                      className="flex items-center"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Enable Location
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Results Section */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium">
              {isLocationEnabled && location
                ? `Shops in ${location.city}, ${location.state}`
                : 'All Shops'}
              {filteredShops.length > 0 && ` (${filteredShops.length})`}
            </h2>
            
            {searchTerm && (
              <p className="text-sm">
                Search results for: <span className="font-medium">"{searchTerm}"</span>
              </p>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredShops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map((shop, index) => (
                <ShopCard key={shop.id} shop={shop} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
              <Store className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No shops found</h3>
              <p className="text-haluna-text-light mb-6 max-w-lg mx-auto">
                We couldn't find any shops matching your search.
                {searchTerm && " Try different search terms or clear your filters."}
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Browse;
