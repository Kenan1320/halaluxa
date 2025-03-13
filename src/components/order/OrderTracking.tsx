
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import { Map, Package, Check, Clock, TruckIcon, Home, External } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, mapboxConfig } from '@/lib/utils';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PickupNotification from './PickupNotification';
import ShippingTracking from './ShippingTracking';

// Set Mapbox token
mapboxgl.accessToken = mapboxConfig.publicToken;

// Order status types
type OrderStatus = 'received' | 'preparing' | 'ready' | 'on_the_way' | 'completed' | 'canceled';

// Mock order for demo purposes
const MOCK_ORDER = {
  id: 'ORD123456',
  shopId: 'SHOP1',
  shopName: 'Halal Delights',
  status: 'ready' as OrderStatus,
  items: [
    { id: 1, name: 'Halal Chicken', quantity: 2, price: 15.99 },
    { id: 2, name: 'Rice', quantity: 1, price: 4.99 },
    { id: 3, name: 'Salad', quantity: 1, price: 3.99 }
  ],
  total: 40.96,
  createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
  estimatedDelivery: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes from now
  deliveryAddress: '123 Main Street, San Francisco, CA 94105',
  deliveryMethod: 'pickup', // 'delivery', 'pickup', or 'shipping'
  driverInfo: {
    name: 'Ahmed Khan',
    phone: '+1 (555) 123-4567',
    location: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  },
  shopLocation: {
    latitude: 37.7855,
    longitude: -122.4071
  },
  destinationLocation: {
    latitude: 37.7695,
    longitude: -122.4143
  }
};

const OrderTracking: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { location } = useLocation();
  const [order, setOrder] = useState(MOCK_ORDER);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'details' | 'map'>('status');
  const [showPickupNotification, setShowPickupNotification] = useState(false);
  const mapContainer = React.useRef<HTMLDivElement>(null);
  const driverMarker = React.useRef<mapboxgl.Marker | null>(null);

  const statusInfo = {
    received: {
      title: 'Order Received',
      description: 'Your order has been received by the shop.',
      icon: <Check className="h-6 w-6" />,
      color: 'bg-blue-500 text-white'
    },
    preparing: {
      title: 'Being Prepared',
      description: 'The shop is now preparing your order.',
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-amber-500 text-white'
    },
    ready: {
      title: 'Ready for Pickup/Delivery',
      description: order.deliveryMethod === 'pickup' 
        ? 'Your order is ready for pickup.' 
        : 'Your order is ready and awaiting delivery.',
      icon: <Package className="h-6 w-6" />,
      color: 'bg-purple-500 text-white'
    },
    on_the_way: {
      title: 'On the Way',
      description: 'Your order is on the way to your location.',
      icon: <TruckIcon className="h-6 w-6" />,
      color: 'bg-indigo-500 text-white'
    },
    completed: {
      title: 'Delivered',
      description: 'Your order has been delivered. Enjoy!',
      icon: <Home className="h-6 w-6" />,
      color: 'bg-green-500 text-white'
    },
    canceled: {
      title: 'Canceled',
      description: 'This order has been canceled.',
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-red-500 text-white'
    }
  };

  // Calculate progress percentage based on status
  const getProgressPercentage = (status: OrderStatus) => {
    const statusValues = {
      received: 0,
      preparing: 25,
      ready: 50,
      on_the_way: 75,
      completed: 100,
      canceled: 0
    };
    return statusValues[status];
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' });
  };

  // Calculate remaining time
  const getRemainingTime = () => {
    if (!order.estimatedDelivery) return 'Calculating...';
    
    const estimatedDelivery = new Date(order.estimatedDelivery);
    const now = new Date();
    const remainingMs = estimatedDelivery.getTime() - now.getTime();
    
    if (remainingMs <= 0) return 'Any minute now';
    
    const remainingMinutes = Math.floor(remainingMs / 60000);
    return `${remainingMinutes} minutes`;
  };

  // Initialize map and driver location
  useEffect(() => {
    if (!mapContainer.current || !order.driverInfo || order.status !== 'on_the_way' || activeTab !== 'map') return;
    
    // Create new map
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapboxConfig.styles.streets,
      center: [order.driverInfo.location.longitude, order.driverInfo.location.latitude],
      zoom: 12,
      pitch: 45
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');

    // When map loads, add markers and route
    map.on('load', () => {
      // Add shop marker
      new mapboxgl.Marker({ color: '#2A866A' })
        .setLngLat([order.shopLocation.longitude, order.shopLocation.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Shop: ' + order.shopName))
        .addTo(map);
      
      // Add destination marker
      new mapboxgl.Marker({ color: '#FF7A45' })
        .setLngLat([order.destinationLocation.longitude, order.destinationLocation.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Delivery Address'))
        .addTo(map);
      
      // Add driver marker
      driverMarker.current = new mapboxgl.Marker({ color: '#4263EB' })
        .setLngLat([order.driverInfo.location.longitude, order.driverInfo.location.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Driver: ' + order.driverInfo.name))
        .addTo(map);

      // Add route line
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [order.shopLocation.longitude, order.shopLocation.latitude],
              [order.driverInfo.location.longitude, order.driverInfo.location.latitude],
              [order.destinationLocation.longitude, order.destinationLocation.latitude]
            ]
          }
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#4263EB',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

      // Fit bounds to show all markers
      const bounds = new mapboxgl.LngLatBounds()
        .extend([order.shopLocation.longitude, order.shopLocation.latitude])
        .extend([order.destinationLocation.longitude, order.destinationLocation.latitude])
        .extend([order.driverInfo.location.longitude, order.driverInfo.location.latitude]);

      map.fitBounds(bounds, { padding: 80 });
    });

    setMapInstance(map);

    // Simulate driver movement
    let step = 0;
    const pointsBase = [
      [order.driverInfo.location.longitude, order.driverInfo.location.latitude],
      [-122.4164, 37.7723],
      [-122.4154, 37.7713],
      [-122.4144, 37.7703],
      [order.destinationLocation.longitude, order.destinationLocation.latitude]
    ];
    const points = pointsBase.map(([lng, lat], i) => {
      // Slightly randomize intermediate points
      if (i > 0 && i < pointsBase.length - 1) {
        return [
          lng + (Math.random() * 0.002 - 0.001),
          lat + (Math.random() * 0.002 - 0.001)
        ];
      }
      return [lng, lat];
    });

    const interval = setInterval(() => {
      if (step < points.length - 1) {
        step++;
        const newLng = points[step][0];
        const newLat = points[step][1];
        
        // Update driver marker position
        if (driverMarker.current) {
          driverMarker.current.setLngLat([newLng, newLat]);
        }

        // Update route
        const routeSource = map.getSource('route');
        if (routeSource && 'setData' in routeSource) {
          routeSource.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [order.shopLocation.longitude, order.shopLocation.latitude],
                ...points.slice(0, step + 1)
              ]
            }
          });
        }
      } else {
        clearInterval(interval);
      }
    }, 5000);

    // Clean up on unmount
    return () => {
      clearInterval(interval);
      map.remove();
    };
  }, [order, isLoading, activeTab]);

  // Simulate loading order data
  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, fetch order from the database
        // For now, simulate a loading delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get order from query params or localStorage in a real app
        // For demo, we use the mock order
        const params = new URLSearchParams(window.location.search);
        const deliveryMethod = params.get('method');
        
        if (deliveryMethod && ['delivery', 'pickup', 'shipping'].includes(deliveryMethod)) {
          setOrder({
            ...MOCK_ORDER,
            deliveryMethod: deliveryMethod as 'delivery' | 'pickup' | 'shipping'
          });
        } else {
          setOrder(MOCK_ORDER);
        }
      } catch (error) {
        console.error('Error loading order details:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading order',
          description: 'Could not load order details. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrder();
    
    // Set up real-time subscription for order updates
    const orderSubscription = supabase
      .channel(`order-${MOCK_ORDER.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${MOCK_ORDER.id}` },
        (payload) => {
          if (payload.new) {
            setOrder(prev => ({ ...prev, ...payload.new }));
          }
        }
      )
      .subscribe();
      
    return () => {
      orderSubscription.unsubscribe();
    };
  }, [toast]);

  // Handle pick up notification complete
  const handlePickupNotificationComplete = () => {
    setShowPickupNotification(false);
    setOrder(prev => ({
      ...prev,
      status: 'completed'
    }));
    
    toast({
      title: "Pickup confirmed",
      description: "Your order status has been updated to completed"
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // Show pickup notification if ready for pickup
  if (showPickupNotification) {
    return (
      <div className="container max-w-md mx-auto p-4 pb-20">
        <PickupNotification 
          orderId={order.id} 
          shopId={order.shopId} 
          onComplete={handlePickupNotificationComplete}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-500 dark:text-gray-400">Order #{order.id}</p>
        </div>
        
        {/* Progress bar */}
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
            <motion.div 
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                order.status === 'canceled' ? 'bg-red-500' : 'bg-[#2A866A]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage(order.status)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Order Placed</span>
            <span>Preparing</span>
            <span>Ready</span>
            <span>{order.deliveryMethod === 'shipping' ? 'Shipped' : 'On the Way'}</span>
            <span>{order.deliveryMethod === 'shipping' ? 'Delivered' : 'Completed'}</span>
          </div>
        </div>
        
        {/* Tabs for different views */}
        <Tabs defaultValue="status" value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            {order.status === 'on_the_way' && (
              <TabsTrigger value="map">Map</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="status" className="pt-2">
            {/* Status card */}
            <Card className="border border-gray-200 dark:border-gray-700 mb-6">
              <CardHeader className={`${statusInfo[order.status].color} text-white rounded-t-lg`}>
                <div className="flex items-center">
                  {statusInfo[order.status].icon}
                  <CardTitle className="ml-2">{statusInfo[order.status].title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-600 dark:text-gray-300 mb-3">{statusInfo[order.status].description}</p>
                
                {order.status === 'on_the_way' && order.estimatedDelivery && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Estimated Delivery</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-lg font-bold text-blue-800 dark:text-blue-200">{formatDate(order.estimatedDelivery)}</p>
                      <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                        {getRemainingTime()}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {order.status === 'ready' && order.deliveryMethod === 'pickup' && (
                  <div className="mt-3">
                    <Button 
                      onClick={() => setShowPickupNotification(true)}
                      className="w-full"
                    >
                      I've Arrived for Pickup
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Delivery, Pickup, or Shipping specific components */}
            {order.deliveryMethod === 'shipping' && (
              <ShippingTracking orderId={order.id} />
            )}
            
            {/* Order items */}
            <Card className="mb-3">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Number</h4>
                  <p className="font-medium">{order.id}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Order Placed</h4>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Shop</h4>
                  <p className="font-medium">{order.shopName}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {order.deliveryMethod === 'delivery' ? 'Delivery Address' : 
                     order.deliveryMethod === 'shipping' ? 'Shipping Address' : 'Pickup Location'}
                  </h4>
                  <p className="font-medium">{order.deliveryAddress || 'Store Location'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Delivery Method</h4>
                  <p className="font-medium capitalize">{order.deliveryMethod}</p>
                </div>
                
                {order.status === 'on_the_way' && order.driverInfo && order.deliveryMethod === 'delivery' && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Driver</h4>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{order.driverInfo.name}</p>
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        Call Driver
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Support options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Request Refund
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <External className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {order.status === 'on_the_way' && (
            <TabsContent value="map" className="pt-2">
              <Card className="overflow-hidden mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Live Delivery Tracking</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div ref={mapContainer} className="w-full h-64" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Estimated Arrival</span>
                      <span className="font-medium">{formatDate(order.estimatedDelivery)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Driver</span>
                      <span className="font-medium">{order.driverInfo?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        On the way
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Call Driver
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default OrderTracking;
