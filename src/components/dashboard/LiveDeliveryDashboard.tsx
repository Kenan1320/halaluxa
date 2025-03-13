
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, AlertCircle, CheckCircle, Clock, ShoppingBag, Truck, MapPin, Calendar, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

// Order status types
type OrderStatus = 'received' | 'preparing' | 'ready' | 'on_the_way' | 'completed' | 'canceled';

// Mock order type (will be replaced with real data)
interface Order {
  id: string;
  shop_id: string;
  shopper_id: string;
  shopper_name: string;
  status: OrderStatus;
  items: any[];
  total: number;
  created_at: string;
  estimated_delivery?: string;
  delivery_address?: string;
  driver_info?: {
    id: string;
    name: string;
    phone: string;
  };
}

// For demo purposes (replace with real order fetching)
const MOCK_ORDERS: Order[] = [
  {
    id: '123456',
    shop_id: '1',
    shopper_id: 'user123',
    shopper_name: 'Ahmed Mahmoud',
    status: 'received',
    items: [
      { name: 'Halal Chicken', quantity: 2, price: 15.99 },
      { name: 'Rice', quantity: 1, price: 4.99 }
    ],
    total: 36.97,
    created_at: new Date().toISOString(),
    delivery_address: '123 Main St, New York, NY 10001'
  },
  {
    id: '123457',
    shop_id: '1',
    shopper_id: 'user124',
    shopper_name: 'Sara Khan',
    status: 'preparing',
    items: [
      { name: 'Halal Beef', quantity: 1, price: 18.99 },
      { name: 'Pita Bread', quantity: 2, price: 3.99 }
    ],
    total: 26.97,
    created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    delivery_address: '456 Park Ave, New York, NY 10002'
  },
  {
    id: '123458',
    shop_id: '1',
    shopper_id: 'user125',
    shopper_name: 'Omar Hassan',
    status: 'ready',
    items: [
      { name: 'Falafel Wrap', quantity: 3, price: 7.99 },
      { name: 'Hummus', quantity: 1, price: 5.99 }
    ],
    total: 29.96,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    delivery_address: '789 Broadway, New York, NY 10003'
  },
  {
    id: '123459',
    shop_id: '1',
    shopper_id: 'user126',
    shopper_name: 'Fatima Ali',
    status: 'on_the_way',
    items: [
      { name: 'Lamb Gyro', quantity: 2, price: 12.99 },
      { name: 'Greek Salad', quantity: 1, price: 8.99 }
    ],
    total: 34.97,
    created_at: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
    delivery_address: '321 5th Ave, New York, NY 10004',
    driver_info: {
      id: 'driver1',
      name: 'Khalid Rahman',
      phone: '+1 (555) 123-4567'
    }
  },
  {
    id: '123460',
    shop_id: '1',
    shopper_id: 'user127',
    shopper_name: 'Zainab Mohammed',
    status: 'completed',
    items: [
      { name: 'Chicken Shawarma', quantity: 2, price: 11.99 },
      { name: 'Baklava', quantity: 3, price: 3.99 }
    ],
    total: 35.95,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    delivery_address: '567 West St, New York, NY 10005'
  },
  {
    id: '123461',
    shop_id: '1',
    shopper_id: 'user128',
    shopper_name: 'Mohammed Ali',
    status: 'canceled',
    items: [
      { name: 'Mixed Grill', quantity: 1, price: 24.99 }
    ],
    total: 24.99,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    delivery_address: '890 East End Ave, New York, NY 10006'
  }
];

// Order card component
const OrderCard: React.FC<{
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}> = ({ order, onUpdateStatus }) => {
  const { toast } = useToast();
  
  const statusColors = {
    received: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    preparing: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    ready: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    on_the_way: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    canceled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };
  
  const statusLabels = {
    received: 'Order Received',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    on_the_way: 'On the Way',
    completed: 'Delivered',
    canceled: 'Canceled'
  };
  
  const statusIcons = {
    received: <CheckCircle className="h-4 w-4 mr-1" />,
    preparing: <Clock className="h-4 w-4 mr-1" />,
    ready: <ShoppingBag className="h-4 w-4 mr-1" />,
    on_the_way: <Truck className="h-4 w-4 mr-1" />,
    completed: <CheckCircle className="h-4 w-4 mr-1" />,
    canceled: <AlertCircle className="h-4 w-4 mr-1" />
  };
  
  // Get next status options based on current status
  const getNextStatusOptions = () => {
    switch (order.status) {
      case 'received':
        return [
          { value: 'preparing', label: 'Start Preparing' },
          { value: 'canceled', label: 'Cancel Order' }
        ];
      case 'preparing':
        return [
          { value: 'ready', label: 'Mark as Ready' },
          { value: 'canceled', label: 'Cancel Order' }
        ];
      case 'ready':
        return [
          { value: 'on_the_way', label: 'Start Delivery' },
          { value: 'completed', label: 'Mark as Picked Up' },
          { value: 'canceled', label: 'Cancel Order' }
        ];
      case 'on_the_way':
        return [
          { value: 'completed', label: 'Mark as Delivered' },
          { value: 'canceled', label: 'Cancel Order' }
        ];
      default:
        return [];
    }
  };
  
  const nextStatusOptions = getNextStatusOptions();
  const hasUpdateOptions = nextStatusOptions.length > 0;
  
  const handleStatusUpdate = (status: OrderStatus) => {
    onUpdateStatus(order.id, status);
    
    // Show notification
    toast({
      title: "Order Updated",
      description: `Order #${order.id} status changed to ${statusLabels[status]}`,
    });
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="mb-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                Order #{order.id}
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})
                </span>
              </CardTitle>
              <CardDescription>
                {order.shopper_name} • ${order.total.toFixed(2)}
              </CardDescription>
            </div>
            <Badge variant="outline" className={`${statusColors[order.status]} flex items-center`}>
              {statusIcons[order.status]}
              {statusLabels[order.status]}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="space-y-1 mb-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          {order.delivery_address && (
            <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 mt-3">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
              <span>{order.delivery_address}</span>
            </div>
          )}
          
          {order.driver_info && order.status === 'on_the_way' && (
            <div className="mt-3 text-sm">
              <div className="text-gray-600 dark:text-gray-400">
                Driver: {order.driver_info.name} • {order.driver_info.phone}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          {hasUpdateOptions ? (
            <div className="flex justify-between w-full gap-x-2">
              {nextStatusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={option.value === 'canceled' ? 'destructive' : 'default'}
                  size="sm"
                  className={
                    option.value !== 'canceled' 
                      ? 'bg-[#2A866A] hover:bg-[#1f6e55] text-white'
                      : ''
                  }
                  onClick={() => handleStatusUpdate(option.value as OrderStatus)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {order.status === 'completed' 
                ? 'Order completed' 
                : order.status === 'canceled' 
                  ? 'Order canceled' 
                  : 'No actions available'}
            </span>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const LiveDeliveryDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  
  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      
      try {
        // In a real application, we would fetch orders from our database
        // For this demo, we'll use mock data
        
        // Simulate API request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get mock orders
        setOrders(MOCK_ORDERS);
        
      } catch (error) {
        console.error('Error loading orders:', error);
        toast({
          variant: "destructive",
          title: "Error loading orders",
          description: "There was a problem loading your orders. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
    
    // Set up real-time subscription for order updates
    const orderSubscription = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          // Handle real-time order updates
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new as Order, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => 
              order.id === payload.new.id ? { ...order, ...payload.new as Order } : order
            ));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();
      
    return () => {
      orderSubscription.unsubscribe();
    };
  }, [toast]);
  
  // Filter orders based on active tab, search query, and date filter
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply tab filter
    if (activeTab === 'active') {
      filtered = filtered.filter(order => 
        ['received', 'preparing', 'ready', 'on_the_way'].includes(order.status)
      );
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(order => order.status === 'completed');
    } else if (activeTab === 'canceled') {
      filtered = filtered.filter(order => order.status === 'canceled');
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.id.includes(searchQuery) ||
        order.shopper_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at).setHours(0, 0, 0, 0);
        return orderDate === filterDate;
      });
    }
    
    // Sort orders
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setFilteredOrders(filtered);
  }, [orders, activeTab, searchQuery, dateFilter]);
  
  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // In a real application, we would update the order in our database
      // For this demo, we'll update the local state
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      // In a real app, this would be an API call
      // await updateOrderStatus(orderId, status);
      
      // Simulate sending notification to user
      toast({
        title: "Customer notified",
        description: `Customer has been notified about the order status change.`,
      });
      
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error updating order",
        description: "There was a problem updating the order status. Please try again.",
      });
    }
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setDateFilter(null);
  };
  
  // Calculate order counts
  const activeOrdersCount = orders.filter(order => 
    ['received', 'preparing', 'ready', 'on_the_way'].includes(order.status)
  ).length;
  
  const completedOrdersCount = orders.filter(order => order.status === 'completed').length;
  const canceledOrdersCount = orders.filter(order => order.status === 'canceled').length;
  
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Live Delivery Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and track your delivery orders in real-time</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <Button variant="ghost" className="gap-2" onClick={() => window.location.reload()}>
            <Clock className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#2A866A]">{activeOrdersCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completedOrdersCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-lg">Canceled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{canceledOrdersCount}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by order ID, customer name, or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            type="date"
            value={dateFilter || ''}
            onChange={(e) => setDateFilter(e.target.value ? e.target.value : null)}
            className="w-40"
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setActiveTab('active')}>
                Active Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('completed')}>
                Completed Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('canceled')}>
                Canceled Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('all')}>
                All Orders
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(searchQuery || dateFilter) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="relative">
            Active
            {activeOrdersCount > 0 && (
              <span className="ml-1 bg-[#2A866A] text-white px-1.5 py-0.5 rounded-full text-xs">
                {activeOrdersCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex gap-2 w-full">
                      <Skeleton className="h-9 w-1/2" />
                      <Skeleton className="h-9 w-1/2" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-400px)]">
              <AnimatePresence>
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                ))}
              </AnimatePresence>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No active orders</h3>
              <p className="text-gray-500 dark:text-gray-400">
                When customers place orders, they'll appear here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <Card key={i} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-400px)]">
              <AnimatePresence>
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                ))}
              </AnimatePresence>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No completed orders</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Completed orders will be shown here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="canceled">
          {isLoading ? (
            <div className="space-y-4">
              <Card className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : filteredOrders.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-400px)]">
              <AnimatePresence>
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                ))}
              </AnimatePresence>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No canceled orders</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Canceled orders will be shown here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="mb-4">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOrders.length > 0 ? (
            <ScrollArea className="h-[calc(100vh-400px)]">
              <AnimatePresence>
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                ))}
              </AnimatePresence>
            </ScrollArea>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No orders found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your filters to see more results.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveDeliveryDashboard;
