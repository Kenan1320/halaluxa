
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product, productCategories } from '@/models/product';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Filter, Heart, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getProducts } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '@/components/icons/CategoryIcons';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location.search]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProducts = async () => {
      setIsLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (categoryFilter) {
      queryParams.set('category', categoryFilter);
    }
    navigate({ search: queryParams.toString() }, { replace: true });
  }, [categoryFilter, navigate]);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-center text-black dark:text-white">Shop Halal Products</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 text-center max-w-3xl mx-auto">
              Browse our collection of halal products from verified Muslim businesses.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-12 pr-4 py-3 w-full border dark:border-gray-700 rounded-full shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-black dark:focus:border-white transition bg-white dark:bg-gray-800 text-black dark:text-white"
                  placeholder="Search for halal products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Category Dropdown */}
              <div className="mb-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full border border-gray-200 dark:border-gray-700 flex justify-between items-center py-6 px-4 rounded-xl bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        {categoryFilter ? (
                          <>
                            <div className="h-6 w-6">
                              {getCategoryIcon(categoryFilter)}
                            </div>
                            <span className="text-black dark:text-white">
                              {categoryFilter}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            All Categories
                          </span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0 border-none shadow-lg" align="center">
                    <div className="max-h-80 overflow-y-auto py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => setCategoryFilter('')}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          categoryFilter === '' ? 'bg-gray-100 dark:bg-gray-700' : ''
                        }`}
                      >
                        <span className="text-black dark:text-white">All Categories</span>
                      </button>
                      
                      {productCategories.map(category => (
                        <button
                          key={category}
                          onClick={() => setCategoryFilter(category)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            categoryFilter === category ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } flex items-center gap-2`}
                        >
                          <div className="h-5 w-5">
                            {getCategoryIcon(category, "h-5 w-5")}
                          </div>
                          <span className="text-black dark:text-white">{category}</span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </motion.div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2 text-black dark:text-white">No products found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              {products.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">
                  Looks like there are no products available yet. Check back soon!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/product/${product.id}`} className="block relative h-48 overflow-hidden">
                    <img
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                        <Heart className="h-4 w-4 text-black dark:text-white" />
                      </button>
                    </div>
                    {product.isHalalCertified && (
                      <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-full">
                        Halal Certified
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link to={`/product/${product.id}`} className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                      </div>
                      <p className="font-bold text-black dark:text-white">${product.price.toFixed(2)}</p>
                    </div>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <Link to={`/shop/${product.sellerId}`} className="text-xs text-black dark:text-white hover:underline mb-3 inline-block">
                      {product.sellerName || "Seller"}
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{product.rating || 5.0}</span>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className="transition-transform hover:scale-105 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
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

export default Shop;
