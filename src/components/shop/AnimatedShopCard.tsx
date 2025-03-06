
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Shop } from '@/services/shopService';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from 'react';
import { Button } from '../ui/button';

interface AnimatedShopCardProps {
  shop: Shop;
  index: number;
}

const AnimatedShopCard = ({ shop, index }: AnimatedShopCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="relative w-full cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center h-32">
          {shop.logo ? (
            <img 
              src={shop.logo} 
              alt={shop.name}
              className="w-16 h-16 object-contain mb-2"
            />
          ) : (
            <div className="w-16 h-16 bg-haluna-primary-light rounded-full flex items-center justify-center mb-2">
              <Store className="w-6 h-6 text-haluna-primary" />
            </div>
          )}
          <h3 className="text-center font-medium text-sm">{shop.name}</h3>
        </div>
      </motion.div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{shop.name}</DialogTitle>
            <DialogDescription>
              {shop.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {shop.location && (
              <p className="text-sm text-muted-foreground">
                📍 {shop.location}
              </p>
            )}
            <Button className="w-full" asChild>
              <Link to={`/shop/${shop.id}`}>
                Visit Shop
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnimatedShopCard;
