
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import ShopCard from '@/components/shop/ShopCard';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/context/LocationContext';

const NearbyShops = () => {
  const navigate = useNavigate();
  const { location } = useLocation();
  
  // Placeholder shop data
  const shops = [
    {
      id: 1,
      name: "Halal Corner Market",
      description: "Authentic halal food and groceries",
      logo: "/lovable-uploads/89740c6a-e07a-4ee4-a5a6-6eb842382e3c.png",
      category: "Grocery",
      rating: 4.8,
      reviewCount: 124,
      distance: "1.2 miles"
    },
    {
      id: 2,
      name: "Barakah Butcher Shop",
      description: "Premium halal meats, fresh daily",
      logo: "/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png",
      category: "Butcher",
      rating: 4.7,
      reviewCount: 89,
      distance: "2.1 miles"
    },
    {
      id: 3,
      name: "Sunnah Gifts",
      description: "Islamic gifts and home decor",
      logo: "/lovable-uploads/8d386384-3944-48e3-922c-2edb81fa1631.png",
      category: "Gifts",
      rating: 4.5,
      reviewCount: 67,
      distance: "3.4 miles"
    },
    {
      id: 4,
      name: "Modest Hijab Studio",
      description: "Beautiful hijabs and modest wear",
      logo: "/lovable-uploads/3c7163e3-7825-410e-b6d1-2e91e6ec2442.png",
      category: "Clothing",
      rating: 4.9,
      reviewCount: 156,
      distance: "1.8 miles"
    },
  ];
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <div className="w-full mt-1">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-foreground">
          <Store className="inline-block mr-2 h-5 w-5 text-primary" />
          <span>Nearby Shops</span>
        </h2>
        
        <Button 
          variant="link" 
          size="sm" 
          className="text-primary" 
          onClick={() => navigate('/shops')}
        >
          See All
        </Button>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {shops.map((shop) => (
          <motion.div key={shop.id} variants={itemVariants}>
            <ShopCard shop={shop} />
          </motion.div>
        ))}
      </motion.div>
      
      <div className="flex justify-center mt-6">
        <Button 
          className="rounded-full px-6"
          onClick={() => navigate('/shops')}
        >
          Explore All Shops
        </Button>
      </div>
    </div>
  );
};

export default NearbyShops;
