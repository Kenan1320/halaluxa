
import { useState } from 'react';
import { ArrowLeft, Heart, Search, MoreHorizontal, Clock, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopDetails } from '@/types/shop';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

interface ShopHeaderProps {
  shop: ShopDetails;
}

export function ShopHeader({ shop }: ShopHeaderProps) {
  const navigate = useNavigate();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');

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
            <button className="text-white">
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Shop Logo & Info */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white p-1">
            <img 
              src={shop.logo || '/placeholder.svg'} 
              alt={shop.name} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold">{shop.name}</h1>
            <div className="flex items-center gap-2 text-sm">
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
      </div>
    </div>
  );
}
