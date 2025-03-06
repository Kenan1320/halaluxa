
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Shop } from '@/services/shopService';

interface AnimatedShopCardProps {
  shop: Shop;
  index: number;
}

const AnimatedShopCard = ({ shop, index }: AnimatedShopCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="relative w-full"
    >
      <Link to={`/shop/${shop.id}`} className="block">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center h-40">
          {shop.logo ? (
            <img 
              src={shop.logo} 
              alt={shop.name}
              className="w-20 h-20 object-contain mb-3"
            />
          ) : (
            <div className="w-20 h-20 bg-haluna-primary-light rounded-full flex items-center justify-center mb-3">
              <Store className="w-8 h-8 text-haluna-primary" />
            </div>
          )}
          <h3 className="text-center font-medium text-sm line-clamp-2">{shop.name}</h3>
        </div>
      </Link>
    </motion.div>
  );
};

export default AnimatedShopCard;
