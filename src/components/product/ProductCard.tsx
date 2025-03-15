
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/models/product';
import { normalizeProduct } from '@/lib/normalizeData';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Normalize product to ensure consistent property access
  const normalizedProduct = normalizeProduct(product);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/product/${normalizedProduct.id}`} className="block">
        <div className="h-48 bg-gray-100 overflow-hidden">
          {normalizedProduct.images && normalizedProduct.images.length > 0 ? (
            <img
              src={normalizedProduct.images[0]}
              alt={normalizedProduct.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
          {normalizedProduct.is_halal_certified && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Halal
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1">{normalizedProduct.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{normalizedProduct.description}</p>
          
          <div className="flex justify-between items-center">
            <span className="font-bold text-green-600">${normalizedProduct.price.toFixed(2)}</span>
            <span className="text-xs text-gray-500">{normalizedProduct.category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
