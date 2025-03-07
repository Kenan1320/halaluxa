
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter, Edit, Trash2, RefreshCw } from 'lucide-react';
import { getProductsBySeller, deleteProduct, Product } from '@/services/productService';
import { subscribeToShopProducts } from '@/services/shopService';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Function to load products
  const loadProducts = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await getProductsBySeller(user.id);
      setProducts(data);
      applyFilters(data, searchTerm, activeCategory);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadProducts();
    
    // Set up real-time subscription for products
    let subscription: RealtimeChannel | null = null;
    
    if (user?.id) {
      subscription = subscribeToShopProducts(user.id, (updatedProducts) => {
        setProducts(updatedProducts);
        applyFilters(updatedProducts, searchTerm, activeCategory);
      });
    }
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user?.id]);
  
  // Apply filters based on search term and active category
  const applyFilters = (productsToFilter: Product[], search: string, category: string) => {
    let result = [...productsToFilter];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }
    
    setFilteredProducts(result);
  };
  
  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(products, value, activeCategory);
  };
  
  // Handle category filter change
  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
    applyFilters(products, searchTerm, category);
  };
  
  // Handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsDeleting(id);
      try {
        const success = await deleteProduct(id);
        if (success) {
          toast({
            title: "Success",
            description: "Product deleted successfully",
          });
          
          // Real-time update should handle this, but just in case:
          loadProducts();
        } else {
          throw new Error("Failed to delete product");
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-haluna-text">Products</h1>
          <p className="text-haluna-text-light">Manage your product inventory</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => navigate('/dashboard/add-product')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-haluna-primary focus:border-haluna-primary sm:text-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center overflow-x-auto pb-2 md:pb-0">
            <Filter className="h-5 w-5 text-gray-500 mr-2 shrink-0" />
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                    activeCategory === category
                      ? 'bg-haluna-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Display loading state */}
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        // Empty state
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="h-16 w-16 bg-haluna-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-haluna-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-haluna-text-light mb-6">
            {products.length === 0
              ? "You haven't added any products yet. Start by adding your first product."
              : "No products match your current filters. Try adjusting your search or category filters."}
          </p>
          {products.length === 0 && (
            <Button onClick={() => navigate('/dashboard/add-product')}>
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        // Product list
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100">
                          <img 
                            src={product.images[0] || '/placeholder.svg'} 
                            alt={product.name} 
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-haluna-primary-light text-haluna-primary">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.inStock ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/dashboard/edit-product/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={isDeleting === product.id}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"
                        >
                          {isDeleting === product.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
