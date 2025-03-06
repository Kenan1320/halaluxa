
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Store, Search, MapPin, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { getShops } from '@/services/shopService';

const Shops = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchShops = async () => {
      setIsLoading(true);
      const fetchedShops = await getShops();
      setShops(fetchedShops);
      setIsLoading(false);
    };
    
    fetchShops();
  }, []);
  
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">Discover Muslim Businesses</h1>
            <p className="text-haluna-text-light text-lg mb-8 text-center max-w-3xl mx-auto">
              Browse and support Muslim-owned businesses offering a wide range of halal products and services.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative">
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
            </div>
          </motion.div>
          
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
                <motion.div 
                  key={shop.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="h-40 bg-gradient-to-r from-haluna-primary to-purple-600 relative overflow-hidden">
                    {shop.coverImage ? (
                      <img 
                        src={shop.coverImage} 
                        alt={shop.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Store className="h-16 w-16 text-white" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-xs font-medium">
                      {shop.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-medium">{shop.name}</h3>
                        <div className="flex items-center text-haluna-text-light text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{shop.location}</span>
                        </div>
                      </div>
                      {shop.logo && (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-white shadow-sm">
                          <img 
                            src={shop.logo} 
                            alt={`${shop.name} logo`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-haluna-text-light mb-4 line-clamp-2">
                      {shop.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">{shop.productCount}</span> Products
                      </div>
                      <Link to={`/shop/${shop.id}`}>
                        <Button size="sm" className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          View Shop
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
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
