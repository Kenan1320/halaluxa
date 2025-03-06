
import { useState, useEffect } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from '@/context/LocationContext';
import Navbar from '@/components/layout/Navbar';
import BottomNavigation from '@/components/layout/BottomNavigation';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search as SearchIcon, 
  MapPin, 
  Filter, 
  SlidersHorizontal,
  Sparkles,
  History,
  Store,
  ShoppingBag
} from 'lucide-react';
import { getProducts } from '@/services/productService';
import { getAllShops } from '@/services/shopService';
import { motion } from 'framer-motion';

const Search = () => {
  const { isLocationEnabled, location, requestLocation } = useLocation();
  const routerLocation = useRouterLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState(['Halal Meat', 'Hijab', 'Prayer Mat', 'Islamic Books', 'Eid Gifts']);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  // Parse search params from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(routerLocation.search);
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      handleSearch(query);
    }
  }, [routerLocation.search]);

  // Load products and shops
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const productsData = await getProducts();
        const shopsData = await getAllShops();
        setProducts(productsData);
        setShops(shopsData);
      } catch (error) {
        console.error('Error loading search data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    
    // Save search to recent searches
    const updatedRecentSearches = [
      term,
      ...recentSearches.filter(search => search !== term)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
    
    // Filter results based on search term
    const searchTermLower = term.toLowerCase();
    
    let filtered;
    if (selectedTab === 'all' || selectedTab === 'products') {
      const filteredProducts = products.filter(product => 
        product.name?.toLowerCase().includes(searchTermLower) || 
        product.description?.toLowerCase().includes(searchTermLower) ||
        product.category?.toLowerCase().includes(searchTermLower)
      );
      filtered = filteredProducts;
    } else if (selectedTab === 'shops') {
      const filteredShops = shops.filter(shop => 
        shop.name?.toLowerCase().includes(searchTermLower) || 
        shop.description?.toLowerCase().includes(searchTermLower) ||
        shop.location?.toLowerCase().includes(searchTermLower)
      );
      filtered = filteredShops;
    }
    
    setFilteredResults(filtered);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim()) {
      handleSearch(e.target.value);
    }
  };

  // Render product or shop card based on selected tab
  const renderCard = (item) => {
    if ((selectedTab === 'all' || selectedTab === 'products') && item.price !== undefined) {
      // Product card
      return (
        <motion.div 
          key={item.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div 
            className="h-36 bg-cover bg-center" 
            style={{ backgroundImage: `url(${item.images?.[0] || '/placeholder.svg'})` }}
          />
          <div className="p-4">
            <h3 className="font-medium line-clamp-1">{item.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{item.sellerName}</p>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">${item.price.toFixed(2)}</span>
              <Button size="sm" className="h-8">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </motion.div>
      );
    } else if ((selectedTab === 'all' || selectedTab === 'shops') && item.logo !== undefined) {
      // Shop card
      return (
        <motion.div 
          key={item.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden flex items-center p-4 gap-4"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div 
            className="h-12 w-12 rounded-full bg-cover bg-center flex-shrink-0" 
            style={{ backgroundImage: `url(${item.logo || '/placeholder.svg'})` }}
          />
          <div className="flex-grow">
            <h3 className="font-medium line-clamp-1">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.location || 'No location'}</p>
          </div>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Store className="h-4 w-4 mr-1" />
            View
          </Button>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-serif font-bold mb-6">Search</h1>
          
          {/* Search Bar */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search for products, shops, or categories..."
                value={searchTerm}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-3 rounded-full border-gray-300 focus:border-haluna-primary focus:ring-haluna-primary"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            {isLocationEnabled ? (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={requestLocation}
              >
                <MapPin className="h-4 w-4" />
                {location?.city || 'Current Location'}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 whitespace-nowrap"
                onClick={requestLocation}
              >
                <MapPin className="h-4 w-4" />
                Set Location
              </Button>
            )}
            
            <Button variant="outline" className="p-2">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
          
          {/* If no search term, show recent and trending searches */}
          {!searchTerm && (
            <div className="space-y-6 mb-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-medium flex items-center">
                      <History className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h2>
                    <Button 
                      variant="link" 
                      className="text-sm text-gray-500"
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem('recentSearches');
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSearchTerm(search);
                          handleSearch(search);
                        }}
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Trending Searches */}
              <div>
                <h2 className="text-lg font-medium flex items-center mb-3">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Trending Searches
                </h2>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchTerm(search);
                        handleSearch(search);
                      }}
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Search Results */}
          {searchTerm && (
            <div className="mt-6">
              <Tabs 
                defaultValue="all" 
                value={selectedTab}
                onValueChange={(value) => {
                  setSelectedTab(value);
                  handleSearch(searchTerm);
                }}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="shops">Shops</TabsTrigger>
                  </TabsList>
                  
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Sort & Filter
                  </Button>
                </div>
                
                <TabsContent value="all" className="mt-0">
                  {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-100 h-48 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="space-y-4">
                      {filteredResults.map(renderCard)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <SearchIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No results found</h3>
                      <p className="text-gray-500">
                        Try different keywords or browse categories
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="products" className="mt-0">
                  {/* Product results will be shown here */}
                  {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-100 h-48 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredResults.map(renderCard)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No products found</h3>
                      <p className="text-gray-500">
                        Try different keywords or browse categories
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="shops" className="mt-0">
                  {/* Shop results will be shown here */}
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 h-16 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="space-y-4">
                      {filteredResults.map(renderCard)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Store className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No shops found</h3>
                      <p className="text-gray-500">
                        Try different keywords or check nearby shops
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Search;
