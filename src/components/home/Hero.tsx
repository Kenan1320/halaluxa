
import { ArrowRight, LogIn, UserPlus, Store, Search, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { getProducts } from '@/services/productService';
import { Product } from '@/models/product';
import { motion } from 'framer-motion';

const Hero = () => {
  const { isLoggedIn, user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get featured products (just using the first 4 products for now)
    const products = getProducts();
    setFeaturedProducts(products.slice(0, 4));
  }, []);
  
  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-haluna-primary-light to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">
            <span className="inline-block px-4 py-1 rounded-full bg-haluna-accent text-haluna-text text-sm font-medium mb-4 animate-fade-in">
              Shop Muslim Businesses and Shops
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6 animate-fade-in animate-delay-100">
              The Premier <span className="text-haluna-primary">Halal</span> Marketplace
            </h1>
            <p className="text-haluna-text-light text-lg md:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in animate-delay-200">
              Connect with authentic Muslim businesses and discover ethically sourced products that align with your values.
            </p>
            
            {/* New "Browse Categories & Shops" button with animation */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button 
                href="/browse" 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-haluna-primary to-purple-600 hover:from-purple-600 hover:to-haluna-primary transition-all duration-500 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-white/20 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <div className="flex items-center relative z-10">
                  <Store className="mr-2 h-5 w-5" />
                  <span>Browse Categories & Shops</span>
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Button>
            </motion.div>
            
            {isLoggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in animate-delay-300">
                <Button 
                  href={user?.role === 'business' ? '/dashboard' : '/shop'} 
                  size="lg" 
                  className="flex items-center"
                >
                  {user?.role === 'business' ? 'Go to Dashboard' : 'Start Shopping'} 
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in animate-delay-300">
                <Button href="/signup" size="lg" className="flex items-center">
                  <UserPlus size={18} className="mr-2" />
                  Sign Up
                </Button>
                <Button href="/login" variant="outline" size="lg" className="flex items-center">
                  <LogIn size={18} className="mr-2" />
                  Log In
                </Button>
              </div>
            )}
            
            <div className="mt-10 grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0 animate-fade-in animate-delay-400">
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">250+</p>
                <p className="text-haluna-text-light text-sm">Muslim Sellers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">2,500+</p>
                <p className="text-haluna-text-light text-sm">Halal Products</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-serif font-bold text-haluna-primary">10,000+</p>
                <p className="text-haluna-text-light text-sm">Happy Customers</p>
              </div>
            </div>
          </div>
          
          {/* Featured Products */}
          <div className="lg:w-1/2 relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 animate-float">
              <h3 className="text-xl font-serif font-bold text-haluna-primary mb-4 text-center">Featured Products</h3>
              
              {featuredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="aspect-square rounded-md overflow-hidden bg-gray-100 mb-2">
                        <img 
                          src={product.images[0] || '/placeholder.svg'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                      <p className="text-haluna-primary font-medium text-sm mt-1">${product.price.toFixed(2)}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs px-2 py-1 bg-haluna-primary-light text-haluna-primary rounded-full">
                          {product.category}
                        </span>
                        {product.isHalalCertified && (
                          <span className="text-xs text-green-600 font-medium">Halal</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-haluna-text-light mb-4">Start exploring our marketplace!</p>
                  <Button href="/shop" size="sm">Browse Products</Button>
                </div>
              )}
              
              <div className="text-center mt-4">
                <Button href="/shop" variant="link" className="text-sm">
                  View All Products <ArrowRight size={14} className="ml-1 inline" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
