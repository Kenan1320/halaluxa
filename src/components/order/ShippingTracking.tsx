
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Package, Truck, Calendar, Check, AlertCircle } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/database';
import { motion } from 'framer-motion';

interface ShippingTrackingProps {
  orderId: string;
  initialData?: {
    carrier: string;
    trackingNumber: string;
    status: string;
    estimatedDelivery: string;
    events: ShippingEvent[];
  };
}

interface ShippingEvent {
  date: string;
  location: string;
  description: string;
  status: string;
}

const ShippingTracking: React.FC<ShippingTrackingProps> = ({ orderId, initialData }) => {
  const [isLoading, setIsLoading] = useState(!initialData);
  const [trackingData, setTrackingData] = useState(initialData);
  const [order, setOrder] = useState<Order | null>(null);

  // Mock shipping data for demo
  const mockShippingData = {
    carrier: "USPS",
    trackingNumber: "9400123456789012345678",
    status: "in_transit",
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    events: [
      {
        date: new Date().toISOString(),
        location: "Distribution Center, Dallas, TX",
        description: "Departed USPS Regional Facility",
        status: "in_transit"
      },
      {
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        location: "Regional Facility, Dallas, TX",
        description: "Arrived at USPS Regional Facility",
        status: "in_transit"
      },
      {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        location: "Distribution Center, Houston, TX",
        description: "Accepted at USPS Origin Facility",
        status: "accepted"
      },
      {
        date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        location: "Seller Facility",
        description: "Shipping Label Created, USPS Awaiting Item",
        status: "pre_transit"
      }
    ]
  };

  useEffect(() => {
    const loadTrackingData = async () => {
      try {
        setIsLoading(true);
        
        // Get order details from database
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
          
        if (orderError) throw orderError;
        
        setOrder(orderData as Order);
        
        // In a real app, we would use the carrier and tracking number to fetch real tracking data
        // For this demo, we'll use mock data with slight randomization
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Use mock data
        setTrackingData(mockShippingData);
        
        // Subscribe to real-time updates for this order
        const orderSubscription = supabase
          .channel(`order-shipping-${orderId}`)
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'orders', 
              filter: `id=eq.${orderId}` 
            },
            (payload) => {
              setOrder(payload.new as Order);
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(orderSubscription);
        };
        
      } catch (error) {
        console.error('Error loading shipping tracking data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!initialData) {
      loadTrackingData();
    }
  }, [orderId, initialData]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'in_transit':
        return 'bg-blue-500';
      case 'out_for_delivery':
        return 'bg-purple-500';
      case 'exception':
        return 'bg-red-500';
      case 'pre_transit':
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in_transit':
        return 'In Transit';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'exception':
        return 'Delivery Exception';
      case 'pre_transit':
        return 'Shipping Label Created';
      default:
        return 'Processing';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Check className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'out_for_delivery':
        return <Package className="h-4 w-4" />;
      case 'exception':
        return <AlertCircle className="h-4 w-4" />;
      case 'pre_transit':
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="border-b">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-36 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trackingData) {
    return (
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <div className="py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tracking information yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Tracking details will appear here once your order has been shipped.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <CardTitle>Shipping Status</CardTitle>
          <Badge 
            className={`${getStatusColor(trackingData.status)} text-white`}
          >
            {getStatusText(trackingData.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Carrier</span>
              <span className="font-medium">{trackingData.carrier}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Tracking Number</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{trackingData.trackingNumber}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7"
                  onClick={() => window.open(`https://tools.usps.com/go/TrackConfirmAction?tRef=fullpage&tLc=2&text28777=&tLabels=${trackingData.trackingNumber}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Estimated Delivery</span>
              <span className="font-medium">{formatDate(trackingData.estimatedDelivery)}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm text-blue-700 dark:text-blue-300">
            Your package is on its way and should arrive in 3 days.
          </div>

          <Separator className="my-4" />
          
          <div>
            <h4 className="font-medium mb-3">Tracking History</h4>
            <div className="space-y-6">
              {trackingData.events.map((event, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-6"
                >
                  {/* Timeline bar */}
                  {index < trackingData.events.length - 1 && (
                    <div className="absolute left-[9px] top-4 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                  )}
                  
                  {/* Status dot */}
                  <div className={`absolute left-0 top-1 h-[18px] w-[18px] rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                    {getStatusIcon(event.status)}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-medium">{event.description}</h5>
                      <span className="text-xs text-gray-500">{formatDateTime(event.date)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingTracking;
