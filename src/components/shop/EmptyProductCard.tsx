
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package2 } from 'lucide-react';

interface EmptyProductCardProps {
  index?: number;
}

const EmptyProductCard = ({ index = 0 }: EmptyProductCardProps) => {
  // Alternate between a few color schemes for visual variety
  const colors = [
    'from-[#F2FCE2]/40 to-[#E2EFC8]/20 dark:from-[#2A866A]/20 dark:to-[#0d1b2a]/30',
    'from-[#D3E4FD]/40 to-[#B4D1F8]/20 dark:from-[#517fa4]/20 dark:to-[#0d1b2a]/30',
    'from-[#E5E0FF]/40 to-[#D1CAFF]/20 dark:from-[#3D5A80]/20 dark:to-[#0d1b2a]/30'
  ];
  
  const color = colors[index % colors.length];
  
  return (
    <motion.div 
      className={`product-card-empty h-48 md:h-64 bg-gradient-to-br ${color} rounded-lg overflow-hidden relative`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots opacity-5"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
        <motion.div 
          className="w-16 h-16 rounded-full bg-white/70 dark:bg-white/10 flex items-center justify-center shadow-sm"
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0 rgba(74, 222, 128, 0)",
              "0 0 10px rgba(74, 222, 128, 0.3)",
              "0 0 0 rgba(74, 222, 128, 0)"
            ]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            repeatType: "mirror" 
          }}
        >
          {index % 2 === 0 ? 
            <ShoppingBag className="w-8 h-8 text-primary/70" /> : 
            <Package2 className="w-8 h-8 text-primary/70" />
          }
        </motion.div>
        
        <h3 className="text-lg font-medium text-foreground text-center">
          Products Coming Soon
        </h3>
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ translateX: "200%" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
        />
      </div>
    </motion.div>
  );
};

export default EmptyProductCard;
