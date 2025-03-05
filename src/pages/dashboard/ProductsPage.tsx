
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getProducts, deleteProduct } from '@/services/productService';
import { Product } from '@/models/product';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = () => {
    const allProducts = getProducts();
    
    // Only show products for the current seller
    if (user) {
      const sellerProducts = allProducts.filter(product => product.sellerId === user.id);
      setProducts(sellerProducts);
    }
  };
  
  const handleDeleteProduct = (productId: string) => {
    try {
      deleteProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      loadProducts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-haluna-text">Your Products</h1>
          <p className="text-haluna-text-light">Manage your products and inventory</p>
        </div>
        <Button href="/dashboard/products/new" className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-haluna-text-light h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded-lg pl-10 py-2 w-full focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="h-16 w-16 bg-haluna-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="h-8 w-8 text-haluna-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-haluna-text-light mb-6">
            {products.length === 0
              ? "You haven't added any products yet. Start by adding your first product."
              : "No products match your search criteria. Try a different search term."}
          </p>
          {products.length === 0 && (
            <Button href="/dashboard/products/new">
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-haluna-text-light uppercase tracking-wider">
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
                          <div className="text-sm font-medium text-haluna-text">{product.name}</div>
                          <div className="text-sm text-haluna-text-light line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-haluna-primary-light text-haluna-primary">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-haluna-text">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-haluna-text">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock > 0 ? (
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
                          to={`/dashboard/products/edit/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
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
