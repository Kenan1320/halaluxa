
import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Clock, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Mock order interface
interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  total: number;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  pickup: {
    type: 'in_store' | 'curbside' | null;
    vehicleColor: string | null;
    status: 'pending' | 'arriving' | 'arrived' | 'completed';
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

// Mock orders
const mockOrders: Order[] = [
  {
    id: 'ORD-12345',
    customerName: 'John Smith',
    orderDate: '2024-07-10T14:30:00Z',
    total: 87.50,
    status: 'pending',
    pickup: {
      type: 'in_store',
      vehicleColor: null,
      status: 'pending'
    },
    items: [
      { id: '1', name: 'Organic Halal Chicken', quantity: 2, price: 15.99 },
      { id: '2', name: 'Premium Dates', quantity: 1, price: 12.50 }
    ]
  },
  {
    id: 'ORD-12346',
    customerName: 'Sarah Johnson',
    orderDate: '2024-07-10T11:15:00Z',
    total: 45.99,
    status: 'processing',
    pickup: {
      type: 'curbside',
      vehicleColor: 'Red SUV',
      status: 'arriving'
    },
    items: [
      { id: '3', name: 'Modest Hijab - Floral', quantity: 1, price: 29.99 },
      { id: '4', name: 'Prayer Beads', quantity: 1, price: 16.00 }
    ]
  },
  {
    id: 'ORD-12347',
    customerName: 'Mohammed Ali',
    orderDate: '2024-07-09T16:45:00Z',
    total: 128.75,
    status: 'ready',
    pickup: {
      type: 'curbside',
      vehicleColor: 'Blue Sedan',
      status: 'arrived'
    },
    items: [
      { id: '5', name: 'Qur\'an with Translation', quantity: 1, price: 45.99 },
      { id: '6', name: 'Prayer Rug - Deluxe', quantity: 1, price: 69.99 },
      { id: '7', name: 'Islamic Wall Art', quantity: 1, price: 12.77 }
    ]
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // In a real app, this would be a fetch call to your API
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={cn(variants[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  const getPickupBadge = (pickup: Order['pickup']) => {
    if (!pickup.type) return null;
    
    const pickupLabel = pickup.type === 'in_store' ? 'In-Store' : 'Curbside';
    const statusVariants = {
      pending: 'bg-gray-100 text-gray-800',
      arriving: 'bg-blue-100 text-blue-800',
      arrived: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <div className="space-y-1">
        <Badge variant="outline" className="bg-white border-gray-300">
          {pickup.type === 'in_store' ? (
            <Clock className="h-3 w-3 mr-1" />
          ) : (
            <Car className="h-3 w-3 mr-1" />
          )}
          {pickupLabel}
        </Badge>
        {pickup.status !== 'pending' && (
          <Badge className={cn(statusVariants[pickup.status])}>
            {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
          </Badge>
        )}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-haluna-text">Orders</h1>
          <p className="text-haluna-text-light">Manage your customer orders</p>
        </div>
        
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">Orders</h1>
        <p className="text-haluna-text-light">Manage your customer orders</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-haluna-primary/50"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <div className="flex items-center">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready">Ready for Pickup</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-haluna-text-light mx-auto mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-haluna-text-light mt-2">
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your filters"
                : "You don't have any orders yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPickupBadge(order.pickup)}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
