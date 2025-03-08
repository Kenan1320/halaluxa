import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search as SearchIcon, Filter, MapPin } from 'lucide-react';
import { useLocation as useLocationHook } from '@/context/LocationContext';
import { getShops } from '@/services/shopService';
import { searchProducts } from '@/services/productService';
import ProductCard from '@/components/cards/ProductCard';
import ShopCard from '@/components/shop/ShopCard';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('shops');
  const { location } = useLocationHook();
  
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const shopsData = await getShops();
        setShops(shopsData);
      } catch (error) {
        console.error('Error loading shops:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm) {
        setIsLoading(true);
        try {
          const productsData = await searchProducts(searchTerm);
          setProducts(productsData);
        } catch (error) {
          console.error('Error searching products:', error);
          setProducts([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setProducts([]);
      }
    };
    
    performSearch();
  }, [searchTerm]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const hasSearchResults = filteredShops.length > 0 || products.length > 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search shops and products"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-12 pr-4 py-3 rounded-full border-gray-300 focus:ring-haluna-primary focus:border-haluna-primary"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Button className="ml-4 rounded-full bg-haluna-primary hover:bg-haluna-primary-dark text-white">
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="bg-gray-50 border border-gray-200 rounded-full p-1 flex w-fit">
          <TabsTrigger value="shops" className="data-[state=active]:bg-haluna-primary data-[state=active]:text-white rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none">
            Shops
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-haluna-primary data-[state=active]:text-white rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none">
            Products
          </TabsTrigger>
        </TabsList>
        <TabsContent value="shops" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(index => (
                <div key={index} className="animate-pulse rounded-lg p-4 bg-gray-100">
                  <div className="h-48 w-full bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 w-3/4 bg-gray-300 rounded-lg mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : hasSearchResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShops.map(shop => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No shops found</h3>
              <p className="text-gray-500">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="products" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(index => (
                <div key={index} className="animate-pulse rounded-lg p-4 bg-gray-100">
                  <div className="h-48 w-full bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 w-3/4 bg-gray-300 rounded-lg mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {location && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            Nearby: {location.city}, {location.state}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
