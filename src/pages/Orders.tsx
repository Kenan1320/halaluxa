
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PackageOpen, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

// Mock order data - in a real app, this would come from an API
interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

const mockOrders: Order[] = [
  {
    id: 'ORD-123456',
    date: '2023-08-15T10:30:00Z',
    status: 'delivered',
    total: 78.48,
    items: [
      {
        id: '1',
        productName: 'Organic Halal Chicken',
        quantity: 2,
        price: 12.99,
        image: '/lovable-uploads/0c423741-0711-4e97-8c56-ca4fe31dc6ca.png'
      },
      {
        id: '3',
        productName: 'Natural Rose Water Face Toner',
        quantity: 1,
        price: 18.50,
        image: '/lovable-uploads/9c75ca26-bc1a-4718-84bb-67d7f2337b30.png'
      },
      {
        id: '4',
        productName: 'Decorative Arabic Calligraphy Frame',
        quantity: 1,
        price: 39.99,
        image: '/lovable-uploads/d8db1529-74b3-4d86-b64a-f0c8b0f92c5c.png'
      }
    ]
  },
  {
    id: 'ORD-123457',
    date: '2023-09-20T14:45:00Z',
    status: 'shipped',
    total: 49.98,
    items: [
      {
        id: '2',
        productName: 'Modest Hijab - Navy Blue',
        quantity: 2,
        price: 24.99,
        image: '/lovable-uploads/26c50a86-ec95-4072-8f0c-ac930a65b34d.png'
      }
    ]
  }
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-yellow-100 text-yellow-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check authentication
    if (!isLoggedIn || (user && user.role !== 'shopper')) {
      navigate('/login');
      return;
    }
    
    // Fetch orders - in a real app, this would be an API call
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate, user]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">My Orders</h1>
            <div className="animate-pulse space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold">My Orders</h1>
            
            <Button 
              onClick={() => navigate('/shop')} 
              variant="outline"
            >
              Continue Shopping
            </Button>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <PackageOpen className="h-16 w-16 text-haluna-text-light mx-auto mb-4" />
              <h2 className="text-2xl font-medium mb-2">No Orders Yet</h2>
              <p className="text-haluna-text-light mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Browse our collection of halal products and make your first purchase.
              </p>
              <Button onClick={() => navigate('/shop')}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-medium">Order #{order.id}</h2>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-haluna-text-light">
                          Placed on {formatDate(order.date)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">Total: ${order.total.toFixed(2)}</p>
                        <p className="text-sm text-haluna-text-light">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-medium mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-haluna-text-light">
                              Qty: {item.quantity} x ${item.price.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                    <Button variant="link" className="text-haluna-primary p-0">
                      View Order Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Buy Again
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
