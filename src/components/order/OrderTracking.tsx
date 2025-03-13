
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Package, Truck, Clock, ExternalLink, MapPin } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/database';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShippingTracking from './ShippingTracking';
import PickupNotification from './PickupNotification';

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"details" | "tracking">("details");
  const [pickupNotificationCompleted, setPickupNotificationCompleted] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
          
        if (error) throw error;
        
        setOrder(data as unknown as Order);
        
        // Subscribe to real-time updates for this order
        const subscription = supabase
          .channel(`order-${orderId}`)
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'orders', 
              filter: `id=eq.${orderId}` 
            },
            (payload) => {
              setOrder(payload.new as unknown as Order);
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(subscription);
        };
        
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'received':
        return 'Order Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'on_the_way':
        return 'On the Way';
      case 'completed':
        return 'Delivered';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'received':
        return 'bg-blue-500';
      case 'preparing':
        return 'bg-purple-500';
      case 'ready':
        return 'bg-green-500';
      case 'on_the_way':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'canceled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handlePickupNotificationComplete = () => {
    setPickupNotificationCompleted(true);
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Order not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine if this is a pickup order
  const isPickupOrder = order.delivery_method === 'pickup';
  
  // Determine if this is a shipping order
  const isShippingOrder = order.delivery_method === 'shipping';
  
  // Determine if pickup notification is needed (ready for pickup and pickup method)
  const showPickupNotification = 
    isPickupOrder && 
    order.status === 'ready' && 
    !pickupNotificationCompleted;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Order #{orderId?.slice(-6)}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Placed on {formatDateTime(order.created_at)}
        </p>
      </div>
      
      {/* Status indicator */}
      <div className="mb-6">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full ${getStatusColor(order.status)} mr-2`}></div>
          <span className="font-medium">{getStatusLabel(order.status)}</span>
        </div>
      </div>
      
      {/* Pickup notification when the order is ready for pickup */}
      {showPickupNotification && (
        <div className="mb-6">
          <PickupNotification 
            orderId={order.id} 
            shopId={order.shop_id}
            onComplete={handlePickupNotificationComplete}
          />
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "details" | "tracking")}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {/* Delivery method */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Delivery Method
                  </h3>
                  <p className="font-medium capitalize">
                    {order.delivery_method}
                  </p>
                </div>
                
                {/* Payment info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Method
                  </h3>
                  <div className="flex justify-between">
                    <p className="font-medium capitalize">
                      {order.payment_method}
                    </p>
                    <span className={`text-sm font-medium ${
                      order.payment_status === 'paid' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {order.payment_status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Order items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Items
                  </h3>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div className="flex items-start">
                          <span className="text-sm font-medium">{item.quantity}x</span>
                          <div className="ml-2">
                            <p className="font-medium">{item.product_name}</p>
                            {item.options && Object.keys(item.options).length > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {Object.entries(item.options)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tracking">
          {isShippingOrder && (
            <ShippingTracking orderId={order.id} />
          )}
          
          {isPickupOrder && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Pickup Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Pickup Time</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {order.pickup_time ? formatDateTime(order.pickup_time) : 'As soon as ready'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Pickup Location</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Shop pickup counter
                      </p>
                    </div>
                  </div>
                  
                  {order.pickup_details && order.pickup_details.notes && (
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-sm">
                      <p className="font-medium">Additional Notes:</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {order.pickup_details.notes}
                      </p>
                    </div>
                  )}
                  
                  {order.status === 'ready' && !pickupNotificationCompleted && (
                    <Button 
                      className="w-full mt-2"
                      onClick={() => setActiveTab("details")}
                    >
                      Notify Shop About Arrival
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!isPickupOrder && !isShippingOrder && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Delivery Address</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {order.delivery_address || 'No address provided'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Estimated Delivery Time</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {order.estimated_delivery 
                          ? formatDateTime(order.estimated_delivery)
                          : 'No estimate available'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderTracking;
