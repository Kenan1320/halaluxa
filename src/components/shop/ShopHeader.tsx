
import { useState } from 'react';
import { ArrowLeft, Heart, Search, MoreHorizontal, Clock, Users, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopDetails } from '@/types/shop';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { motion } from 'framer-motion';

interface ShopHeaderProps {
  shop: ShopDetails;
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  const navigate = useNavigate();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-background">
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={shop.coverImage || '/placeholder.svg'} 
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
        
        {/* Top Navigation */}
        <div className="absolute top-0 w-full p-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4">
            <button className="text-white">
              <Search className="h-6 w-6" />
            </button>
            <button className="text-white">
              <Heart className="h-6 w-6" />
            </button>
            <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Menu Button for Category Navigation */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Button variant="outline" size="icon" className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20" onClick={() => {}}>
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Shop Logo & Info - Centered */}
        <div className="absolute bottom-0 inset-x-0 flex flex-col items-center mb-4">
          <div className="w-20 h-20 rounded-full bg-white p-1 mb-2">
            <img 
              src={shop.logo || '/placeholder.svg'} 
              alt={shop.name} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span>⭐ {shop.rating.average}</span>
              <span>•</span>
              <span>({shop.rating.count}+ ratings)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      <div className="p-4 bg-background border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Toggle
              pressed={deliveryMode === 'delivery'}
              onPressedChange={() => setDeliveryMode('delivery')}
              className={cn(
                "rounded-full px-4",
                deliveryMode === 'delivery' ? "bg-primary text-white" : "bg-secondary"
              )}
            >
              Delivery
            </Toggle>
            <Toggle
              pressed={deliveryMode === 'pickup'}
              onPressedChange={() => setDeliveryMode('pickup')}
              className={cn(
                "rounded-full px-4",
                deliveryMode === 'pickup' ? "bg-primary text-white" : "bg-secondary"
              )}
            >
              Pickup
            </Toggle>
          </div>
          {shop.isGroupOrderEnabled && (
            <Button variant="outline" className="rounded-full gap-2">
              <Users className="h-4 w-4" />
              Group order
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-card">
            <p className="text-lg font-semibold">
              ${deliveryMode === 'delivery' ? shop.deliveryInfo.deliveryFee.toFixed(2) : '0.00'}
            </p>
            <p className="text-sm text-muted-foreground">
              {deliveryMode === 'delivery' ? 'Delivery fee' : 'No fee for pickup'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-lg font-semibold">{shop.deliveryInfo.estimatedTime}</p>
            </div>
            <p className="text-sm text-muted-foreground">Earliest arrival</p>
          </div>
        </div>
        
        {/* Shop-specific search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder={`Search ${shop.name}`}
              className="w-full h-12 pl-10 pr-4 rounded-full bg-secondary text-foreground placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
      
      {/* More options menu (conditionally rendered) */}
      {menuOpen && (
        <motion.div 
          className="absolute right-0 top-16 bg-card shadow-lg rounded-lg overflow-hidden z-50 w-64"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ul className="py-2">
            <li className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 cursor-pointer transition-colors">
              <Users className="h-5 w-5 text-primary" />
              <span>Start group order</span>
            </li>
            <li className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 cursor-pointer transition-colors">
              <Heart className="h-5 w-5 text-primary" />
              <span>Add to favorites</span>
            </li>
            <li className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 cursor-pointer transition-colors border-t">
              <span className="h-5 w-5 flex items-center justify-center text-primary">ℹ️</span>
              <span>Shop info</span>
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
