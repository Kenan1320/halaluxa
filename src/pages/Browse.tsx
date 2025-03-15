
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProducts } from '@/services/productService';
import { Product, ProductFilter } from '@/models/product';
import { formatPrice } from '@/lib/productUtils';

const Browse = () => {
  const [filters, setFilters] = useState<ProductFilter>({
    category: '',
    min_price: undefined,
    max_price: undefined,
    is_halal_certified: undefined,
    in_stock: true
  });
  
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      return await getProducts(filters);
    }
  });
  
  const products = productsResponse?.data || [];
  
  const handleFilterChange = (filterKey: keyof ProductFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };
  
  if (isLoading) {
    return <div>Loading products...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Browse Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-lg mb-4">Filters</h2>
          
          {/* Filter UI components would go here */}
          <div className="space-y-4">
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                className="w-full border rounded p-2"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                {/* More categories */}
              </select>
            </div>
            
            {/* Price range filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <div className="flex space-x-2">
                <input 
                  type="number"
                  placeholder="Min"
                  className="w-1/2 border rounded p-2"
                  value={filters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
                />
                <input 
                  type="number"
                  placeholder="Max"
                  className="w-1/2 border rounded p-2"
                  value={filters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>
            
            {/* Halal certification filter */}
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="halal"
                className="mr-2"
                checked={filters.is_halal_certified || false}
                onChange={(e) => handleFilterChange('is_halal_certified', e.target.checked ? true : undefined)}
              />
              <label htmlFor="halal">Halal Certified</label>
            </div>
            
            {/* In stock filter */}
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="inStock"
                className="mr-2"
                checked={filters.in_stock || false}
                onChange={(e) => handleFilterChange('in_stock', e.target.checked)}
              />
              <label htmlFor="inStock">In Stock</label>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>{products.length} products found</div>
              
              <select 
                className="border rounded p-2"
                value={filters.sort_by || 'newest'}
                onChange={(e) => handleFilterChange('sort_by', e.target.value as any)}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={product.images[0] || '/placeholder.svg'} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{product.seller_id ? `Sold by: ${product.seller_name || 'Unknown Seller'}` : ''}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="font-bold text-lg">{formatPrice(product.price)}</div>
                      
                      <div className="flex items-center">
                        {product.is_halal_certified && (
                          <span className="mr-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Halal</span>
                        )}
                        
                        {product.in_stock ? (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">In Stock</span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
