
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { getShopById, getShopProducts } from '@/services/shopService';
import { Product } from '@/models/product';

const ShopDetail = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchShopAndProducts = async () => {
      setIsLoading(true);
      if (shopId) {
        const shopData = await getShopById(shopId);
        setShop(shopData);
        
        if (shopData) {
          const shopProducts = await getShopProducts(shopId);
          // Convert shop products to the Product model format
          const modelProducts: Product[] = shopProducts.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            images: p.images,
            category: p.category,
            sellerId: p.sellerId,
            sellerName: p.sellerName,
            rating: p.rating,
            stock: p.stock,
            isHalalCertified: p.isHalalCertified || false,
            createdAt: p.createdAt || new Date().toISOString()
          }));
          
          setProducts(modelProducts);
        }
      }
      setIsLoading(false);
    };
    
    fetchShopAndProducts();
  }, [shopId]);
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-48 bg-muted rounded-lg mb-8"></div>
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!shop) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
            <p className="mb-6">Sorry, the shop you are looking for does not exist or has been removed.</p>
            <Button href="/shops">
              Browse All Shops
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link 
              to="/shops"
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Shops
            </Link>
          </div>
          
          {/* Shop header */}
          <motion.div 
            className="rounded-2xl overflow-hidden shadow-sm mb-12 dark-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-56 relative bg-gradient-to-r from-haluna-primary to-purple-600">
              {shop.coverImage && (
                <img 
                  src={shop.coverImage} 
                  alt={shop.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
            <div className="relative px-6 py-6 bg-card">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-card border-4 border-card rounded-xl shadow-lg overflow-hidden -mt-16 mr-4">
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt={`${shop.name} logo`} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-haluna-primary flex items-center justify-center">
                        <span className="text-2xl font-serif font-bold text-white">
                          {shop.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <h1 className="text-2xl font-serif font-bold">{shop.name}</h1>
                      {shop.isVerified && (
                        <span className="ml-2 bg-haluna-primary-light text-haluna-primary text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{shop.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <div className="flex items-center bg-secondary px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{shop.rating}</span>
                  </div>
                  <div className="bg-secondary px-3 py-1 rounded-full text-sm">
                    {shop.productCount} Products
                  </div>
                </div>
              </div>
              
              <p className="mt-4 text-foreground">{shop.description}</p>
            </div>
          </motion.div>
          
          {/* Shop products */}
          <div>
            <h2 className="text-2xl font-serif font-bold mb-6">Shop Products</h2>
            
            {products.length === 0 ? (
              <div className="text-center py-12 bg-secondary rounded-lg">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Products Available</h3>
                <p className="text-muted-foreground">
                  This shop has not listed any products yet. Check back soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div 
                    key={product.id} 
                    className="bg-card rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300 dark-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link to={`/product/${product.id}`} className="block relative h-48 overflow-hidden">
                      <img
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button className="bg-card p-2 rounded-full shadow-sm hover:bg-secondary transition">
                          <Heart className="h-4 w-4 text-foreground" />
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
                          <Link to={`/product/${product.id}`} className="font-medium text-foreground hover:text-haluna-primary transition-colors">
                            {product.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <p className="font-bold text-haluna-primary">${product.price.toFixed(2)}</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < (product.rating || 5) ? 'fill-current' : ''}`} />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{product.rating || 5.0}</span>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          className="transition-transform hover:scale-105 dark:shadow-black/10"
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopDetail;
