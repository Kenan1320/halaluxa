
import { useState, useEffect } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from '@/context/LocationContext';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/navigation/BottomNav';
import { Search, X, MapPin, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Mock products for search (replace with real API call)
const allProducts = [
  {
    id: '1',
    name: 'Organic Honey',
    price: 12.99,
    image: '/lovable-uploads/8cfca635-4b28-46a6-91a1-ead7c6ca7a36.png',
    category: 'groceries',
    shop: { id: '1', name: 'Organic Foods' }
  },
  {
    id: '2',
    name: 'Halal Chicken',
    price: 9.99,
    image: '/lovable-uploads/ec247b57-88bf-4a59-923a-a81b0366a0f7.png',
    category: 'groceries',
    shop: { id: '2', name: 'Halal Meats' }
  },
  {
    id: '3',
    name: 'Prayer Mat',
    price: 24.99,
    image: '/lovable-uploads/bfa2a431-cfd1-4e49-b350-91e1443316b2.png',
    category: 'home',
    shop: { id: '3', name: 'Islamic Home' }
  },
  // Add more mock products as needed
];

const SearchPage = () => {
  const routerLocation = useRouterLocation();
  const { isLocationEnabled, location, requestLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  
  // Parse query params on load
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [routerLocation]);
  
  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shop.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(allProducts);
    }
  }, [searchQuery]);
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(allProducts);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Search Header */}
      <div className="w-full bg-haluna-primary py-3 px-4 fixed top-0 z-50">
        <div className="container mx-auto">
          <div className="relative flex items-center">
            <Link to="/" className="mr-3 text-white">
              <X className="h-6 w-6" />
            </Link>
            
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Haluna"
                className="w-full bg-white rounded-full pl-10 pr-10 py-2.5 focus:outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              )}
            </div>
            
            <button 
              className="ml-3 text-white"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-6 w-6" />
            </button>
          </div>
          
          {/* Location Bar */}
          <div className="flex items-center mt-3 justify-between">
            <button 
              onClick={() => setShowLocationSelector(!showLocationSelector)}
              className="flex items-center text-white text-sm"
            >
              <MapPin className="h-4 w-4 mr-1" />
              <span className="mr-1">
                {isLocationEnabled && location ? location.city : 'Set location'}
              </span>
              <span>▼</span>
            </button>
            
            {showLocationSelector && (
              <div className="absolute top-20 left-0 right-0 bg-white shadow-lg rounded-b-lg p-4 z-50">
                <h3 className="font-medium mb-2">Choose your location</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={requestLocation}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <MapPin className="h-4 w-4 text-haluna-primary" />
                    <span>Use my current location</span>
                  </button>
                  
                  <div className="border-t my-2"></div>
                  
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <input
                      type="text"
                      placeholder="Enter ZIP code"
                      className="flex-1 p-2 focus:outline-none"
                    />
                    <Button className="rounded-none">Apply</Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                Products
              </button>
              <button className="text-white/80 px-3 py-1 rounded-full text-xs">
                Shops
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter Panel */}
      {isFilterOpen && (
        <motion.div 
          className="fixed top-32 left-0 right-0 bg-white shadow-lg z-40 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="font-medium mb-3">Filter Results</h3>
          
          <div className="mb-4">
            <h4 className="text-sm text-gray-500 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {['All', 'Groceries', 'Clothing', 'Home', 'Food', 'Health'].map(cat => (
                <button 
                  key={cat} 
                  className={`px-3 py-1 rounded-full text-xs ${
                    cat === 'All' 
                      ? 'bg-haluna-primary text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </motion.div>
      )}
      
      <main className="pt-32 px-4">
        <div className="container mx-auto">
          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {searchResults.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="h-28 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs truncate">{product.name}</p>
                      <p className="font-bold text-haluna-primary text-sm">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 truncate">{product.shop.name}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No results found</p>
              <p className="text-sm text-gray-400">Try a different search term</p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default SearchPage;
