
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopById } from '@/services/shopService';
import { getProducts } from '@/services/productService';
import { Product } from '@/models/product';
import { formatPrice } from '@/lib/productUtils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Shop } from '@/types/shop';

function ShopPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Fetch shop details
  useEffect(() => {
    async function fetchShopData() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const shopData = await getShopById(id);
        if (!shopData) {
          toast({
            title: "Shop not found",
            description: "The requested shop could not be found.",
            variant: "destructive"
          });
          navigate('/shops');
          return;
        }
        
        setShop(shopData);
        
        // Fetch products for this shop
        const productsResponse = await getProducts({ shop_id: id });
        if (productsResponse.data) {
          setProducts(productsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast({
          title: "Error",
          description: "Failed to load shop information.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchShopData();
  }, [id, navigate, toast]);
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  // Filter products by active category
  const filteredProducts = activeCategory 
    ? products.filter(product => product.category === activeCategory)
    : products;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
        <p className="mb-6">The shop you're looking for doesn't exist or may have been removed.</p>
        <Button onClick={() => navigate('/shops')}>Browse Shops</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header */}
      <div className="relative rounded-lg overflow-hidden mb-8">
        <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600">
          {shop.cover_image && (
            <img 
              src={shop.cover_image} 
              alt={`${shop.name} cover`} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-center">
            <div className="w-24 h-24 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg mr-4">
              {shop.logo_url ? (
                <img 
                  src={shop.logo_url} 
                  alt={`${shop.name} logo`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-500">
                    {shop.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-white">
              <h1 className="text-3xl font-bold">{shop.name}</h1>
              <div className="flex items-center mt-1">
                <span className="mr-3">{shop.location}</span>
                {shop.is_verified && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Verified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shop Description */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">About {shop.name}</h2>
        <p className="text-gray-700">{shop.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{shop.rating?.toFixed(1) || '0.0'}</div>
            <div className="text-sm text-gray-500">Rating</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {shop.category}
            </div>
            <div className="text-sm text-gray-500">Category</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {shop.is_verified ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-500">Verified</div>
          </div>
        </div>
      </div>
      
      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 overflow-x-auto">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 text-sm rounded-full whitespace-nowrap ${
                activeCategory === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(null)}
            >
              All Products
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No products available</h3>
            <p className="text-gray-500">
              {products.length === 0
                ? "This shop hasn't added any products yet."
                : "No products found in this category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="h-48 bg-gray-100">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="font-bold">{formatPrice(product.price)}</div>
                    
                    <div className="flex items-center space-x-1">
                      {product.is_halal_certified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Halal</span>
                      )}
                      
                      {product.in_stock ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">In Stock</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopPage;
