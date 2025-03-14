
import React from 'react';
import { motion } from 'framer-motion';

interface PromoBannerProps {
  title: string;
  backgroundImage: string;
  discountText?: string;
  actionText?: string;
  onClick?: () => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({
  title,
  backgroundImage,
  discountText = 'up to 20% off',
  actionText = 'Shop Now',
  onClick
}) => {
  return (
    <motion.div 
      className="overflow-hidden rounded-xl relative my-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div 
        className="aspect-[16/9] w-full relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-6">
          <h2 className="text-white text-3xl font-bold">{title}</h2>
          
          <div className="flex items-center justify-between mt-4">
            <button 
              onClick={onClick}
              className="bg-red-600 text-white px-4 py-2 rounded-full font-medium"
            >
              {actionText}
            </button>
            
            {discountText && (
              <div className="bg-red-600 text-white p-2 rounded-full flex flex-col items-center justify-center w-16 h-16 text-xs font-bold">
                <span>{discountText}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;
