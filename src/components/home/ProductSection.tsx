
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SnoonuProductCard from '@/components/shop/SnoonuProductCard';
import { ShopProduct } from '@/models/shop';

interface ProductSectionProps {
  title: string;
  emoji?: string;
  products: ShopProduct[];
  viewAllLink: string;
  backgroundColor?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  emoji,
  products,
  viewAllLink,
  backgroundColor = '#FFF6F1'
}) => {
  if (products.length === 0) return null;
  
  return (
    <div className="my-8 rounded-xl overflow-hidden" style={{ backgroundColor }}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-red-900 flex items-center">
            {title} {emoji && <span className="ml-2">{emoji}</span>}
          </h2>
          
          <Link 
            to={viewAllLink}
            className="text-black font-medium flex items-center"
          >
            See all
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {products.slice(0, 6).map(product => (
            <SnoonuProductCard 
              key={product.id} 
              product={product} 
              isPromo={Math.random() > 0.7}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
