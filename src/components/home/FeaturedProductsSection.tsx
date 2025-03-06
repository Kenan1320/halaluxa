
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock featured products (replace with actual API call)
const featuredProducts = [
  {
    id: '1',
    name: 'Organic Honey',
    price: 12.99,
    image: '/lovable-uploads/8cfca635-4b28-46a6-91a1-ead7c6ca7a36.png',
    category: 'groceries',
    shop: { id: '1', name: 'Organic Foods' }
  },
  {
    id: '2',
    name: 'Halal Chicken',
    price: 9.99,
    image: '/lovable-uploads/ec247b57-88bf-4a59-923a-a81b0366a0f7.png',
    category: 'groceries',
    shop: { id: '2', name: 'Halal Meats' }
  },
  {
    id: '3',
    name: 'Prayer Mat',
    price: 24.99,
    image: '/lovable-uploads/bfa2a431-cfd1-4e49-b350-91e1443316b2.png',
    category: 'home',
    shop: { id: '3', name: 'Islamic Home' }
  },
  {
    id: '4',
    name: 'Dates',
    price: 8.99,
    image: '/lovable-uploads/ec247b57-88bf-4a59-923a-a81b0366a0f7.png',
    category: 'groceries',
    shop: { id: '1', name: 'Organic Foods' }
  },
  {
    id: '5',
    name: 'Modest Scarf',
    price: 19.99,
    image: '/lovable-uploads/bfa2a431-cfd1-4e49-b350-91e1443316b2.png',
    category: 'clothing',
    shop: { id: '4', name: 'Modest Fashion' }
  },
  {
    id: '6',
    name: 'Organic Tea',
    price: 6.99,
    image: '/lovable-uploads/8cfca635-4b28-46a6-91a1-ead7c6ca7a36.png',
    category: 'groceries',
    shop: { id: '1', name: 'Organic Foods' }
  }
];

const FeaturedProductsSection = () => {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
            onClick={() => openQuickView(product)}
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="relative w-full h-28 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 text-center">
                <p className="text-xs truncate text-gray-700">{product.name}</p>
                <p className="font-bold text-haluna-primary">${product.price.toFixed(2)}</p>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              className="absolute bottom-2 right-2 h-7 w-7 p-0 rounded-full bg-white border border-haluna-primary hover:bg-haluna-primary hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                console.log('Add to cart:', product.id);
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={closeQuickView}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-white rounded-lg p-4 w-11/12 max-w-md mx-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
              <button onClick={closeQuickView} className="text-gray-500">×</button>
            </div>
            <div className="flex gap-4">
              <div className="w-1/3">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full aspect-square object-cover rounded-md"
                />
              </div>
              <div className="w-2/3">
                <p className="text-sm text-gray-600 mb-2">From {selectedProduct.shop.name}</p>
                <p className="font-bold text-xl text-haluna-primary mb-4">${selectedProduct.price.toFixed(2)}</p>
                <Button className="w-full mb-2">Add to Cart</Button>
                <Link to={`/product/${selectedProduct.id}`} className="block w-full">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProductsSection;
