
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ShopProductList from '@/components/shop/ShopProductList';
import { Shop } from '@/models/shop';

interface NearbyShopsProps {
  shop: Shop;
}

const NearbyShops: React.FC<NearbyShopsProps> = ({ shop }) => {
  return (
    <>
      {/* Shop header with link */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/shop/${shop.id}`} className="group flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {shop.logo_url ? (
              <img 
                src={shop.logo_url} 
                alt={`${shop.name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-haluna-primary-light flex items-center justify-center">
                <span className="text-xs font-medium text-haluna-primary">
                  {shop.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </motion.div>
          <motion.h3 
            className="text-base font-medium relative"
            whileHover={{ color: "#2A866A" }}
          >
            {shop.name}
            <motion.span
              className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2A866A]"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.h3>
        </Link>
        <Link 
          to={`/shop/${shop.id}`} 
          className="text-xs font-medium text-[#29866B] hover:underline transition-colors duration-300"
        >
          View all
        </Link>
      </div>

      {/* Shop products in horizontal scroll */}
      <ShopProductList shopId={shop.id} />
    </>
  );
};

export default NearbyShops;
