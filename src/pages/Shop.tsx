import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Product, productCategories } from '@/models/product';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Filter, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Parse URL params to get filters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location.search]);
  
  // Fetch products on mount and when they change
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProducts = () => {
      setIsLoading(true);
      const fetchedProducts = getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    };
    
    fetchProducts();
  }, []);
  
  // Update URL when filters change
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">Shop Halal Products</h1>
            <p className="text-haluna-text-light text-lg mb-8 text-center max-w-3xl mx-auto">
              Browse our collection of halal products from verified Muslim businesses.
            </p>
            
            {/* Search and filter */}
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-5 w-5 text-haluna-text-light" />
                </div>
                <input
                  type="text"
                  className="pl-12 pr-4 py-3 w-full border rounded-full focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary transition"
                  placeholder="Search for halal products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === '' 
                      ? 'bg-haluna-primary text-white' 
                      : 'bg-gray-100 text-haluna-text hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter('')}
                >
                  All Products
                </motion.button>
                
                {productCategories.map(category => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm ${
                      categoryFilter === category 
                        ? 'bg-haluna-primary text-white' 
                        : 'bg-gray-100 text-haluna-text hover:bg-gray-200'
                    }`}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-haluna-text-light mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-haluna-text-light mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              {products.length === 0 && (
                <p className="text-haluna-text-light">
                  Looks like there are no products available yet. Check back soon!
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
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
                      <button className="bg-white p-2 rounded-full shadow-sm hover:bg-haluna-primary-light transition">
                        <Heart className="h-4 w-4 text-haluna-text" />
                      </button>
                    </div>
                    {product.isHalalCertified && (
                      <div className="absolute top-3 left-3 bg-haluna-primary text-white text-xs px-2 py-1 rounded-full">
                        Halal Certified
                      </div>
                    )}
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link to={`/product/${product.id}`} className="font-medium text-haluna-text hover:text-haluna-primary transition-colors">
                          {product.name}
                        </Link>
                        <p className="text-xs text-haluna-text-light">{product.category}</p>
                      </div>
                      <p className="font-bold text-haluna-primary">${product.price.toFixed(2)}</p>
                    </div>
                    
                    <p className="text-sm text-haluna-text-light mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <Link to={`/shop/${product.sellerId}`} className="text-xs text-haluna-primary hover:underline mb-3 inline-block">
                      {product.sellerName || "Haluna Seller"}
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        <span className="text-xs text-haluna-text-light ml-1">5.0</span>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className="transition-transform hover:scale-105"
                      >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
