
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { ShopProduct } from '@/models/shop';

interface SnoonuProductCardProps {
  product: ShopProduct;
  isPromo?: boolean;
  onQuickView?: (product: ShopProduct) => void;
}

const SnoonuProductCard: React.FC<SnoonuProductCardProps> = ({ 
  product, 
  isPromo = false,
  onQuickView 
}) => {
  const { toast } = useToast();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg',
      quantity: 1,
      shopId: product.shopId || product.shop_id || '',
      sellerId: product.sellerId || '',
      sellerName: product.sellerName || product.shop_name || 'Shop',
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm h-full relative"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          
          {/* Promo Badge */}
          {isPromo && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Sale
            </div>
          )}
          
          {/* Halal Badge if applicable */}
          {product.isHalalCertified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Halal
            </div>
          )}
          
          {/* Quick view button */}
          {onQuickView && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20">
              <Button 
                variant="secondary" 
                size="sm" 
                className="text-xs"
                onClick={handleQuickView}
              >
                Quick View
              </Button>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-3">
          <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
          
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-lg">{product.price.toFixed(2)} QR</span>
            
            {/* Rating if available */}
            {product.rating && (
              <div className="flex items-center">
                <Star size={12} className="text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-xs">{product.rating}</span>
              </div>
            )}
          </div>
          
          {/* Shop name */}
          <div className="text-xs text-gray-500 mb-3 truncate">
            {product.sellerName || product.shop_name || 'Shop'}
          </div>
          
          {/* Add to cart button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs py-1"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </Link>
    </motion.div>
  );
};

export default SnoonuProductCard;
