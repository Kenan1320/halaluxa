
import React from 'react';
import { Link } from 'react-router-dom';
import { ShopProduct } from '@/models/shop';
import { formatCurrency } from '@/lib/utils';

interface SnoonuProductCardProps {
  product: ShopProduct;
  isPromo?: boolean;
}

const SnoonuProductCard: React.FC<SnoonuProductCardProps> = ({ product, isPromo = false }) => {
  // Get the first image or use a placeholder
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300';

  return (
    <Link 
      to={`/product/${product.id}`} 
      className="block group"
    >
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 h-full hover:shadow-md">
        {/* Image Container */}
        <div className="relative pt-[100%] overflow-hidden bg-gray-50">
          <img 
            src={productImage} 
            alt={product.name} 
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Promo Badge */}
          {isPromo && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Promo
            </div>
          )}
          
          {/* Halal Badge */}
          {product.isHalalCertified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Halal
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-gray-800 group-hover:text-haluna-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-bold text-haluna-primary">
                {formatCurrency(product.price)}
              </p>
              {product.sellerId && (
                <p className="text-xs text-gray-500 mt-1">
                  {product.sellerName || 'Shop'}
                </p>
              )}
            </div>
            
            {product.rating > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SnoonuProductCard;
