
import { useState } from 'react';
import { mockProducts, Product } from '@/models/product';
import { Search, Plus, Edit, Trash2, Tag, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredProducts = products.filter(
    (product) => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been deleted successfully.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-haluna-text">Products</h1>
          <p className="text-haluna-text-light">Manage your product listings</p>
        </div>
        <Button href="/dashboard/products/new">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between flex-wrap gap-4">
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-haluna-text-light" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary transition"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="border rounded-lg px-3 py-2 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary transition">
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Clothing">Clothing</option>
              <option value="Beauty">Beauty</option>
              <option value="Home">Home</option>
            </select>
            <select className="border rounded-lg px-3 py-2 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary transition">
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="date">Date Added</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <Package className="h-12 w-12 text-haluna-text-light mx-auto mb-4" />
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-haluna-text-light mt-1">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button href="/dashboard/products/new" className="mt-4">
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-haluna-text-light uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                          <img src={product.image} alt={product.name} className="h-10 w-10 object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-haluna-text">{product.name}</div>
                          <div className="text-sm text-haluna-text-light truncate max-w-xs">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-haluna-text-light mr-2" />
                        <span className="text-sm text-haluna-text">{product.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-haluna-text">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-haluna-text">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.stock > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 rounded hover:bg-haluna-primary-light text-haluna-text">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 rounded hover:bg-red-100 text-red-500"
                          onClick={() => handleDeleteProduct(product.id)}
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
        )}

        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-haluna-text-light">
            Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> products
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border rounded-md text-haluna-text-light hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md bg-haluna-primary text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded-md text-haluna-text-light hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
