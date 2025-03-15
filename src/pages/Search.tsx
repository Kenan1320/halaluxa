
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product, ProductFilter, ProductResponse } from '@/models/product';
import { searchProducts } from '@/services/productService';
import ProductCard from '@/components/shop/ProductCard';
import { useDebounce } from '@/hooks/useDebounce';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    const search = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const filter: ProductFilter = { search: debouncedSearchTerm };
        const response = await searchProducts(searchTerm, filter);
        // Fix: Ensure we're setting an array from the response
        setSearchResults(response.data || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    search();
  }, [debouncedSearchTerm]);
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {searchResults.length === 0 && !isLoading && (
        <div className="text-center mt-4">No results found.</div>
      )}
    </div>
  );
};

export default Search;
