
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, Truck, ShoppingBag, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shop } from '@/types/database';
import { getShopById } from '@/services/shopService';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Order status types
type OrderStatus = 'received' | 'preparing' | 'ready' | 'on_the_way' | 'completed';

// Mock order type (will be replaced with real data)
interface Order {
  id: string;
  shop_id: string;
  status: OrderStatus;
  items: any[];
  total: number;
  created_at: string;
  estimated_delivery?: string;
  delivery_address?: string;
  driver_location?: {
    lat: number;
    lng: number;
  };
}

// For demo purposes (replace with real order fetching)
const MOCK_ORDERS: Order[] = [
  {
    id: '123456',
    shop_id: '1',
    status: 'received',
    items: [
      { name: 'Halal Chicken', quantity: 2, price: 15.99 },
      { name: 'Rice', quantity: 1, price: 4.99 }
    ],
    total: 36.97,
    created_at: new Date().toISOString(),
    estimated_delivery: new Date(Date.now() + 45 * 60000).toISOString(),
    delivery_address: '123 Main St, New York, NY 10001'
  }
];

const OrderStatusStep: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  isLast?: boolean;
}> = ({ title, description, icon, isActive, isCompleted, isLast = false }) => {
  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.7 }}
          animate={{
            scale: isActive || isCompleted ? 1 : 0.8,
            opacity: isActive || isCompleted ? 1 : 0.7,
            backgroundColor: isCompleted
              ? '#2A866A'
              : isActive
              ? '#f59e0b'
              : '#e5e7eb'
          }}
          transition={{ duration: 0.3 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
            isCompleted
              ? 'bg-[#2A866A] text-white'
              : isActive
              ? 'bg-amber-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
          }`}
        >
          {icon}
        </motion.div>
        {!isLast && (
          <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 mt-2">
            {isCompleted && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 0.5 }}
                className="w-full bg-[#2A866A]"
              />
            )}
          </div>
        )}
      </div>

      <div className="ml-4 mt-1">
        <h3 className={`font-medium ${
          isActive 
            ? 'text-amber-500' 
            : isCompleted 
              ? 'text-[#2A866A]' 
              : 'text-gray-500'
        }`}>
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
};

const OrderTracking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<Shop | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const deliveryMarker = React.useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = React.useRef<mapboxgl.Marker | null>(null);

  // Get shop ID from URL params
  const shopId = searchParams.get('shop');
  const orderId = searchParams.get('order') || MOCK_ORDERS[0].id;

  useEffect(() => {
    const loadShopAndOrder = async () => {
      setIsLoading(true);
      
      if (shopId) {
        const shopData = await getShopById(shopId);
        setShop(shopData);
      }
      
      // For demo, we'll use mock data
      // In a real app, you would fetch the order from your API/database
      const orderData = MOCK_ORDERS.find(o => o.id === orderId) || MOCK_ORDERS[0];
      setOrder(orderData);
      
      setIsLoading(false);
    };
    
    loadShopAndOrder();
    
    // Subscribe to real-time order updates
    const orderSubscription = supabase
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
          // Update order with new data
          setOrder(prev => prev ? { ...prev, ...payload.new as Order } : null);
        }
      )
      .subscribe();
      
    return () => {
      orderSubscription.unsubscribe();
    };
  }, [shopId, orderId]);

  // Initialize map for order with delivery
  useEffect(() => {
    if (!mapContainerRef.current || !order || order.status !== 'on_the_way' || !order.driver_location) return;
    
    // Clean up previous map instance
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    // Create new map
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [order.driver_location.lng, order.driver_location.lat],
      zoom: 14
    });

    map.current.on('load', () => {
      // Add driver marker (delivery location)
      if (order.driver_location) {
        const driverEl = document.createElement('div');
        driverEl.className = 'driver-marker';
        driverEl.innerHTML = `<div class="w-10 h-10 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>`;
        
        deliveryMarker.current = new mapboxgl.Marker(driverEl)
          .setLngLat([order.driver_location.lng, order.driver_location.lat])
          .addTo(map.current!);
      }

      // Add destination marker (where order is going)
      // In a real app, you would convert the delivery address to coordinates
      // For demo, we'll use a nearby location
      if (order.driver_location) {
        const destinationEl = document.createElement('div');
        destinationEl.className = 'destination-marker';
        destinationEl.innerHTML = `<div class="w-10 h-10 bg-[#2A866A] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>`;
        
        const destLng = order.driver_location.lng + 0.01;
        const destLat = order.driver_location.lat + 0.005;
        
        destinationMarker.current = new mapboxgl.Marker(destinationEl)
          .setLngLat([destLng, destLat])
          .addTo(map.current!);
          
        // Add a route line between driver and destination
        if (map.current) {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [
                  [order.driver_location.lng, order.driver_location.lat],
                  [destLng, destLat]
                ]
              }
            }
          });
          
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#2A866A',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });
        }
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [order?.status, order?.driver_location]);

  // For demo purposes, we'll automatically update order status
  useEffect(() => {
    if (!order) return;
    
    const statusProgression: OrderStatus[] = ['received', 'preparing', 'ready', 'on_the_way', 'completed'];
    const currentIndex = statusProgression.indexOf(order.status);
    
    if (currentIndex === statusProgression.length - 1) return;
    
    const timer = setTimeout(() => {
      setOrder(prev => {
        if (!prev) return null;
        
        const newStatus = statusProgression[currentIndex + 1];
        
        // If moving to on_the_way status, add a mock driver location
        if (newStatus === 'on_the_way') {
          return {
            ...prev,
            status: newStatus,
            driver_location: {
              lat: 40.7128,
              lng: -74.006
            }
          };
        }
        
        return {
          ...prev,
          status: newStatus
        };
      });
    }, 10000); // Update every 10 seconds for demo
    
    return () => clearTimeout(timer);
  }, [order?.status]);

  // Calculate which steps are active/completed based on order status
  const getStepState = (stepStatus: OrderStatus) => {
    if (!order) return { isActive: false, isCompleted: false };
    
    const statusOrder: OrderStatus[] = ['received', 'preparing', 'ready', 'on_the_way', 'completed'];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    return {
      isActive: currentIndex === stepIndex,
      isCompleted: currentIndex > stepIndex
    };
  };

  // Handle go back
  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto pt-16 px-4">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-16 w-full mb-6 rounded-lg" />
        <div className="space-y-10">
          <div className="flex">
            <Skeleton className="w-10 h-10 rounded-full mr-4" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="flex">
            <Skeleton className="w-10 h-10 rounded-full mr-4" />
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          <div className="flex">
            <Skeleton className="w-10 h-10 rounded-full mr-4" />
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex">
            <Skeleton className="w-10 h-10 rounded-full mr-4" />
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto pt-16 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Order Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn't find the order you're looking for.
        </p>
        <Button onClick={handleGoBack}>
          Go Back
        </Button>
      </div>
    );
  }
  
  // Format estimated delivery time
  const formatEstimatedTime = () => {
    if (!order.estimated_delivery) return 'Soon';
    
    const estimatedTime = new Date(order.estimated_delivery);
    return estimatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-md mx-auto pt-16 pb-24 px-4">
      <Button
        variant="ghost"
        className="mb-4 -ml-2"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Track Your Order</h1>
        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          <span className="text-sm font-medium">#{order.id}</span>
        </div>
      </div>
      
      {/* Order info card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="font-semibold">{shop?.name || 'Halal Shop'}</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(order.created_at).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs font-medium py-1 px-2 rounded-full">
            {order.status === 'completed' ? 'Delivered' : 'In Progress'}
          </div>
        </div>
        
        {/* Order items summary */}
        <div className="flex flex-col space-y-2 mb-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Delivery information */}
        {order.delivery_address && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
              <div>
                <div className="text-sm font-medium">Delivery Address:</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {order.delivery_address}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Estimated delivery time indicator */}
      {order.status !== 'completed' && (
        <div className="bg-[#2A866A]/10 rounded-lg p-4 mb-6 flex items-center">
          <div className="bg-[#2A866A] rounded-full p-2 mr-3">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Time of Arrival</div>
            <div className="font-medium">{formatEstimatedTime()}</div>
          </div>
        </div>
      )}
      
      {/* Order status timeline */}
      <div className="space-y-8 mb-6">
        <OrderStatusStep
          title="Order Received"
          description="Your order has been received by the store."
          icon={<CheckCircle className="h-5 w-5" />}
          {...getStepState('received')}
        />
        
        <OrderStatusStep
          title="Preparing Your Order"
          description="The store is now preparing your items."
          icon={<ShoppingBag className="h-5 w-5" />}
          {...getStepState('preparing')}
        />
        
        <OrderStatusStep
          title="Order Ready"
          description="Your order is packed and ready for pickup."
          icon={<CheckCircle className="h-5 w-5" />}
          {...getStepState('ready')}
        />
        
        <OrderStatusStep
          title="On The Way"
          description="Your order is on the way to your location."
          icon={<Truck className="h-5 w-5" />}
          {...getStepState('on_the_way')}
          isLast={true}
        />
      </div>
      
      {/* Map for delivery tracking (only show when order is on the way) */}
      {order.status === 'on_the_way' && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Live Delivery Tracking</h2>
          <div 
            ref={mapContainerRef} 
            className="h-60 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          />
        </div>
      )}
      
      {/* Contact store/driver buttons */}
      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1">
          Contact Store
        </Button>
        {order.status === 'on_the_way' && (
          <Button variant="outline" className="flex-1">
            Contact Driver
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
