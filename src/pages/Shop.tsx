
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockProducts, Product } from '@/models/product';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Filter, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const { addToCart } = useCart();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  const categories = ['Food', 'Clothing', 'Beauty', 'Home'];
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-10">
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
                <button
                  className={`px-4 py-2 rounded-full text-sm ${
                    categoryFilter === '' 
                      ? 'bg-haluna-primary text-white' 
                      : 'bg-gray-100 text-haluna-text hover:bg-gray-200'
                  }`}
                  onClick={() => setCategoryFilter('')}
                >
                  All Products
                </button>
                
                {categories.map(category => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full text-sm ${
                      categoryFilter === category 
                        ? 'bg-haluna-primary text-white' 
                        : 'bg-gray-100 text-haluna-text hover:bg-gray-200'
                    }`}
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-haluna-text-light mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-haluna-text-light">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
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
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-haluna-text">{product.name}</h3>
                        <p className="text-xs text-haluna-text-light">{product.category}</p>
                      </div>
                      <p className="font-bold text-haluna-primary">${product.price.toFixed(2)}</p>
                    </div>
                    
                    <p className="text-sm text-haluna-text-light mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        <span className="text-xs text-haluna-text-light ml-1">5.0</span>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                      >
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </div>
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
