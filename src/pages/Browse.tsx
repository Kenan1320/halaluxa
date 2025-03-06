
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getShops } from '@/services/shopService';
import { productCategories } from '@/models/product';
import { MapPin, Search, Store, ChevronRight, Filter, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Browse = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShops, setFilteredShops] = useState([]);
  
  // Fetch shops on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadShops = async () => {
      setIsLoading(true);
      try {
        const shopsData = await getShops();
        setShops(shopsData);
        setFilteredShops(shopsData);
      } catch (error) {
        console.error('Error loading shops:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShops();
  }, []);
  
  // Filter shops based on location and search query
  useEffect(() => {
    if (shops.length === 0) return;
    
    let filtered = [...shops];
    
    if (searchQuery) {
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (location) {
      filtered = filtered.filter(shop => 
        shop.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    setFilteredShops(filtered);
  }, [shops, searchQuery, location]);
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <section className="mb-12">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                Browse Categories & Shops
              </h1>
              <p className="text-haluna-text-light text-lg">
                Discover authentic halal products from verified Muslim businesses near you
              </p>
            </div>
            
            {/* Search and Location Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <input
                    type="text"
                    className="pl-12 pr-4 py-3 w-full border rounded-lg focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary transition"
                    placeholder="Search shops or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <MapPin className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <input
                    type="text"
                    className="pl-12 pr-4 py-3 w-full border rounded-lg focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary transition"
                    placeholder="Filter by location (e.g. Chicago, IL)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  {location && (
                    <button 
                      onClick={() => setLocation('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          {/* Categories Section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-serif font-bold">
                Popular Categories
              </h2>
              <Link to="/shop" className="text-haluna-primary flex items-center hover:underline">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {productCategories.slice(0, 6).map((category, index) => (
                <motion.div 
                  key={category}
                  variants={itemVariants}
                  className="group"
                >
                  <Link 
                    to={`/shop?category=${category}`} 
                    className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-full"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-haluna-${
                      ['primary-light', 'beige', 'sage', 'cream', 'accent', 'secondary'][index % 6]
                    }`}>
                      <img 
                        src={`/lovable-uploads/${['26c50a86-ec95-4072-8f0c-ac930a65b34d.png', '0c423741-0711-4e97-8c56-ca4fe31dc6ca.png', '9c75ca26-bc1a-4718-84bb-67d7f2337b30.png', 'd8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png'][index % 4]}`}
                        alt={category}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <h3 className="font-medium text-center text-haluna-text group-hover:text-haluna-primary transition-colors">
                      {category}
                    </h3>
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={itemVariants}>
                <Link 
                  to="/shop" 
                  className="flex flex-col items-center justify-center p-6 bg-haluna-primary-light/30 rounded-xl border-2 border-dashed border-haluna-primary/30 hover:border-haluna-primary/60 transition-colors h-full"
                >
                  <span className="text-haluna-primary font-medium">View All Categories</span>
                  <ChevronRight size={20} className="mt-2 text-haluna-primary" />
                </Link>
              </motion.div>
            </motion.div>
          </section>
          
          {/* Shops Section */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-serif font-bold">
                {location ? `Shops in ${location}` : 'Featured Shops'}
              </h2>
              <Link to="/shops" className="text-haluna-primary flex items-center hover:underline">
                View All <ChevronRight size={16} />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <Store className="h-16 w-16 text-haluna-text-light mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No shops found</h3>
                <p className="text-haluna-text-light mb-6">
                  {location 
                    ? `We couldn't find any shops in "${location}". Try a different location.` 
                    : "We couldn't find any shops matching your search."}
                </p>
                {(location || searchQuery) && (
                  <Button 
                    onClick={() => {
                      setLocation('');
                      setSearchQuery('');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredShops.map((shop, index) => (
                  <motion.div
                    key={shop.id}
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Link to={`/shop/${shop.id}`} className="block">
                      <div className="relative h-48 bg-gradient-to-r from-haluna-primary-light to-haluna-beige overflow-hidden">
                        {shop.coverImage ? (
                          <img 
                            src={shop.coverImage} 
                            alt={shop.name} 
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Store className="h-16 w-16 text-white/50" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {shop.location}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-lg">{shop.name}</h3>
                            <p className="text-xs text-haluna-text-light">{shop.category}</p>
                          </div>
                          {shop.isVerified && (
                            <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                              Verified
                            </div>
                          )}
                        </div>
                        
                        <p className="text-haluna-text-light text-sm mb-4 line-clamp-2">
                          {shop.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-haluna-text">
                            {shop.productCount} Products
                          </span>
                          <div className="flex items-center text-amber-500">
                            <span>★</span>
                            <span className="ml-1">{shop.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Browse;
