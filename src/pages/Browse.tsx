
import { useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, X, List, Store, ShoppingBag, History, Grid, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLocation } from '@/context/LocationContext';
import { getAllShops, Shop } from '@/services/shopService';
import { getProducts, Product } from '@/services/productService';
import { productCategories } from '@/models/product';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';

// Browse modes
type BrowseMode = 'categories' | 'shops' | 'products' | 'history';

const Browse = () => {
  const { isLocationEnabled, location, requestLocation } = useLocation();
  const routerLocation = useRouterLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn, user } = useAuth();
  const isMobile = useIsMobile();
  
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [browseMode, setBrowseMode] = useState<BrowseMode>('categories');
  const [isLoading, setIsLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Load all shops and products on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load shops
        const allShops = await getAllShops();
        setShops(allShops);
        
        // Load products
        const allProducts = await getProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Update search term when URL parameter changes
  useEffect(() => {
    const searchFromUrl = searchParams.get('search') || '';
    setSearchTerm(searchFromUrl);
    
    // Set browse mode from URL if available
    const modeFromUrl = searchParams.get('mode') as BrowseMode;
    if (modeFromUrl && ['categories', 'shops', 'products', 'history'].includes(modeFromUrl)) {
      setBrowseMode(modeFromUrl);
    }
  }, [searchParams, routerLocation]);
  
  // Set the browse mode and update URL
  const selectBrowseMode = (mode: BrowseMode) => {
    setBrowseMode(mode);
    setSearchParams(params => {
      params.set('mode', mode);
      return params;
    });
  };
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(params => {
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }
      return params;
    });
  };
  
  // Filter shops based on nearness (if location enabled)
  const getNearbyShops = () => {
    if (!isLocationEnabled) return shops;
    
    return [...shops].sort((a, b) => {
      const distanceA = a.distance || Infinity;
      const distanceB = b.distance || Infinity;
      return distanceA - distanceB;
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSearchParams({});
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Browse Halal Products
            </h1>
            <p className="text-haluna-text-light max-w-2xl">
              Discover and shop from Muslim-owned businesses offering halal products and services.
            </p>
          </div>
          
          {/* Browse Mode Selector */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant={browseMode === 'categories' ? 'default' : 'outline'}
                onClick={() => selectBrowseMode('categories')}
                className="h-auto py-3 flex flex-col items-center justify-center"
              >
                <List className="h-5 w-5 mb-1" />
                <span>Categories</span>
              </Button>
              
              <Button
                variant={browseMode === 'shops' ? 'default' : 'outline'}
                onClick={() => selectBrowseMode('shops')}
                className="h-auto py-3 flex flex-col items-center justify-center"
              >
                <Store className="h-5 w-5 mb-1" />
                <span>Shops</span>
              </Button>
              
              <Button
                variant={browseMode === 'products' ? 'default' : 'outline'}
                onClick={() => selectBrowseMode('products')}
                className="h-auto py-3 flex flex-col items-center justify-center"
              >
                <ShoppingBag className="h-5 w-5 mb-1" />
                <span>Products</span>
              </Button>
              
              <Button
                variant={browseMode === 'history' ? 'default' : 'outline'}
                onClick={() => selectBrowseMode('history')}
                className="h-auto py-3 flex flex-col items-center justify-center"
                disabled={!isLoggedIn}
                title={!isLoggedIn ? "Login to view your history" : ""}
              >
                <History className="h-5 w-5 mb-1" />
                <span>History</span>
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, category, or description..."
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
                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  {isLocationEnabled ? (
                    <div className="flex items-center text-sm text-haluna-primary">
                      <MapPin className="h-4 w-4 mr-1" />
                      Showing items near {location?.city || 'your location'}
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
          
          {/* Content Area - Changes based on browse mode */}
          <AnimatePresence mode="wait">
            <motion.div
              key={browseMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Categories Browse Mode */}
              {browseMode === 'categories' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Browse by Categories</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productCategories.map((category) => (
                      <Link
                        key={category}
                        to={`/shop?category=${encodeURIComponent(category)}`}
                        className="group"
                      >
                        <motion.div 
                          className="bg-haluna-primary-light rounded-xl p-6 text-center hover:bg-haluna-primary hover:text-white transition-colors group-hover:shadow-md"
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="h-12 w-12 mx-auto mb-3 bg-white/80 group-hover:bg-white/20 rounded-full flex items-center justify-center">
                            <Grid className="h-6 w-6 text-haluna-primary group-hover:text-white" />
                          </div>
                          <h3 className="font-medium text-haluna-primary group-hover:text-white">{category}</h3>
                          <div className="mt-2 text-sm flex items-center justify-center text-haluna-primary group-hover:text-white/80">
                            <span>View products</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Shops Browse Mode */}
              {browseMode === 'shops' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Browse by Shops</h2>
                  
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 w-20 rounded-full bg-gray-200 mx-auto mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded mx-auto w-16 mb-1"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {getNearbyShops().map((shop, index) => (
                        <Link
                          key={shop.id}
                          to={`/shop/${shop.id}`}
                          className="text-center group"
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="h-20 w-20 mx-auto rounded-full overflow-hidden border bg-white shadow-sm group-hover:shadow-md transition-all mb-3">
                              {shop.logo ? (
                                <img 
                                  src={shop.logo} 
                                  alt={shop.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full bg-haluna-primary-light flex items-center justify-center">
                                  <Store className="h-8 w-8 text-haluna-primary" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium text-sm">{shop.name}</h3>
                            
                            {shop.distance && (
                              <p className="text-xs text-haluna-text-light mt-1">
                                {shop.distance.toFixed(1)} miles away
                              </p>
                            )}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Products Browse Mode */}
              {browseMode === 'products' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Browse All Products</h2>
                  
                  {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {products.map((product, index) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 group"
                        >
                          <motion.img
                            src={product.images[0] || '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.03 }}
                            whileHover={{ scale: 1.05 }}
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <h3 className="text-white text-sm font-medium line-clamp-1">{product.name}</h3>
                            <p className="text-white/80 text-xs line-clamp-1">${product.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* History Browse Mode */}
              {browseMode === 'history' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Your Product History</h2>
                  
                  {!isLoggedIn ? (
                    <div className="text-center py-8">
                      <History className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Login to view your history</h3>
                      <p className="text-haluna-text-light mb-4">Sign in to see your viewed, purchased, and saved items</p>
                      <Button asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <span>Recently Viewed</span>
                          <Link to="/history/viewed" className="ml-auto text-sm text-haluna-primary">View all</Link>
                        </h3>
                        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
                          {/* Mock data for now, would be populated from user's history */}
                          {products.slice(0, 5).map(product => (
                            <div key={product.id} className="flex-none w-32">
                              <Link to={`/product/${product.id}`} className="block">
                                <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                  <img 
                                    src={product.images[0] || '/placeholder.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                                <p className="text-xs text-haluna-text-light">${product.price.toFixed(2)}</p>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <span>Purchased Items</span>
                          <Link to="/history/purchased" className="ml-auto text-sm text-haluna-primary">View all</Link>
                        </h3>
                        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
                          {/* We'll use the same products as placeholder for purchased items */}
                          {products.slice(5, 10).map(product => (
                            <div key={product.id} className="flex-none w-32">
                              <Link to={`/product/${product.id}`} className="block">
                                <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                  <img 
                                    src={product.images[0] || '/placeholder.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                                <p className="text-xs text-haluna-text-light">${product.price.toFixed(2)}</p>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <span>Saved Items</span>
                          <Link to="/history/saved" className="ml-auto text-sm text-haluna-primary">View all</Link>
                        </h3>
                        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
                          {/* We'll use the same products as placeholder for saved items */}
                          {products.slice(10, 15).map(product => (
                            <div key={product.id} className="flex-none w-32">
                              <Link to={`/product/${product.id}`} className="block">
                                <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                  <img 
                                    src={product.images[0] || '/placeholder.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <h4 className="text-sm font-medium line-clamp-1">{product.name}</h4>
                                <p className="text-xs text-haluna-text-light">${product.price.toFixed(2)}</p>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Browse;
