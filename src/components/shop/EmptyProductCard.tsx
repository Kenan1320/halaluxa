
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, Package2, Sparkles, ShoppingBag } from 'lucide-react';

interface EmptyProductCardProps {
  index?: number;
}

const EmptyProductCard = ({ index = 0 }: EmptyProductCardProps) => {
  // Different designs based on index to create variety
  const designs = [
    {
      color: 'from-[#F2FCE2]/40 to-[#E2EFC8]/20',
      darkColor: 'dark:from-[#2A866A]/20 dark:to-[#0d1b2a]/30',
      icon: Package2,
      label: 'Coming Soon'
    },
    {
      color: 'from-[#FEF7CD]/40 to-[#FEE59B]/20',
      darkColor: 'dark:from-[#4ECBA5]/20 dark:to-[#0d1b2a]/30',
      icon: Clock,
      label: 'Future Product'
    },
    {
      color: 'from-[#D3E4FD]/40 to-[#B4D1F8]/20',
      darkColor: 'dark:from-[#517fa4]/20 dark:to-[#0d1b2a]/30',
      icon: Star,
      label: 'New Arrival Soon'
    },
    {
      color: 'from-[#FFE8D9]/40 to-[#FFCCB3]/20',
      darkColor: 'dark:from-[#6A8CAA]/20 dark:to-[#0d1b2a]/30',
      icon: Sparkles,
      label: 'Product Preview'
    },
    {
      color: 'from-[#E5E0FF]/40 to-[#D1CAFF]/20',
      darkColor: 'dark:from-[#3D5A80]/20 dark:to-[#0d1b2a]/30',
      icon: ShoppingBag,
      label: 'Shop Collection'
    }
  ];
  
  const design = designs[index % designs.length];
  const Icon = design.icon;
  
  return (
    <motion.div 
      className={`product-card-empty h-48 md:h-64 bg-gradient-to-br ${design.color} ${design.darkColor}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern-dots opacity-5"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
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
          <Icon className="w-8 h-8 text-primary/70" />
        </motion.div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">{design.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            New products are on the way!
          </p>
        </div>
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
