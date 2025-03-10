
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, DollarSign, Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { getShopById } from '@/services/shopService';
import { useAuth } from '@/context/AuthContext';

// Mock chart data that looks realistic
const salesData = [
  { name: 'Jan', sales: 4200 },
  { name: 'Feb', sales: 3800 },
  { name: 'Mar', sales: 6100 },
  { name: 'Apr', sales: 8000 },
  { name: 'May', sales: 5200 },
  { name: 'Jun', sales: 9300 },
  { name: 'Jul', sales: 11000 },
];

const productData = [
  { name: 'Clothing', value: 45 },
  { name: 'Accessories', value: 28 },
  { name: 'Home', value: 17 },
  { name: 'Books', value: 10 },
];

const customerData = [
  { name: 'New', value: 85 },
  { name: 'Returning', value: 142 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, change, positive = true, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-haluna-text-light text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-full", color)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
    <div className="flex items-center mt-4">
      <span className={cn(
        "text-sm font-medium",
        positive ? "text-green-600" : "text-red-600"
      )}>
        {change}
      </span>
      {positive ? (
        <ArrowUpRight className="h-4 w-4 ml-1 text-green-600" />
      ) : (
        <ArrowDownRight className="h-4 w-4 ml-1 text-red-600" />
      )}
      <span className="text-haluna-text-light text-sm ml-2">vs last month</span>
    </div>
  </div>
);

const DashboardHome = () => {
  const [shopData, setShopData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        if (user) {
          const shop = await getShopById(user.id);
          setShopData(shop);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        toast({
          title: "Couldn't load shop data",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopData();
  }, [user, toast]);

  const recentOrders = [
    {
      id: '1003',
      items: 3,
      total: 120.00,
      status: 'Processing',
      timestamp: 'Today, 2:30 PM',
      customer: 'Ahmed Hassan'
    },
    {
      id: '1002',
      items: 1,
      total: 49.99,
      status: 'Shipped',
      timestamp: 'Yesterday, 11:15 AM',
      customer: 'Sara Ahmed'
    },
    {
      id: '1001',
      items: 5,
      total: 235.50,
      status: 'Delivered',
      timestamp: 'Jul 28, 5:45 PM',
      customer: 'Mohammed Ali'
    }
  ];

  const popularProducts = [
    {
      id: '1',
      name: 'Elegant Abaya',
      price: 89.99,
      sales: 124,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1636372457627-02c41fc98204?q=80&w=120&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'Embroidered Hijab',
      price: 49.99,
      sales: 98,
      stock: 23,
      image: 'https://images.unsplash.com/photo-1577900283879-3f3a8d218577?q=80&w=120&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Premium Prayer Mat',
      price: 65.00,
      sales: 76,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1584286595398-424828f553ed?q=80&w=120&auto=format&fit=crop'
    }
  ];

  const getChartData = () => {
    switch (timeframe) {
      case 'weekly':
        return [
          { name: 'Mon', sales: 1200 },
          { name: 'Tue', sales: 900 },
          { name: 'Wed', sales: 1600 },
          { name: 'Thu', sales: 1200 },
          { name: 'Fri', sales: 2200 },
          { name: 'Sat', sales: 800 },
          { name: 'Sun', sales: 600 },
        ];
      case 'yearly':
        return [
          { name: '2023', sales: 42000 },
          { name: '2024', sales: 51000 },
        ];
      default:
        return salesData;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">Dashboard</h1>
        <p className="text-haluna-text-light">
          {shopData ? `Welcome back to ${shopData.name}` : 'Welcome back to your seller dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Sales"
          value="$4,521"
          change="+12.5%"
          icon={DollarSign}
          color="bg-haluna-primary"
        />
        <StatCard 
          title="Products"
          value="45"
          change="+8.2%"
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard 
          title="Orders"
          value="128"
          change="+23.1%"
          icon={ShoppingCart}
          color="bg-amber-500"
        />
        <StatCard 
          title="Customers"
          value="829"
          change="-2.4%"
          positive={false}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Sales Overview</h2>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-sm border rounded-md ${
                timeframe === 'weekly' 
                  ? 'bg-haluna-primary-light text-haluna-primary' 
                  : 'text-haluna-text-light'
              }`}
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-3 py-1 text-sm border rounded-md ${
                timeframe === 'monthly' 
                  ? 'bg-haluna-primary-light text-haluna-primary' 
                  : 'text-haluna-text-light'
              }`}
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-3 py-1 text-sm border rounded-md ${
                timeframe === 'yearly' 
                  ? 'bg-haluna-primary-light text-haluna-primary' 
                  : 'text-haluna-text-light'
              }`}
              onClick={() => setTimeframe('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={getChartData()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2A866A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2A866A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#2A866A" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-haluna-primary text-sm hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-haluna-text-light">{order.items} items • ${order.total.toFixed(2)}</p>
                  <p className="text-xs text-haluna-text-light mt-1">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </p>
                  <p className="text-sm text-haluna-text-light mt-1">
                    {order.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Customer Demographics</h2>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Popular Products</h2>
            <Link to="/dashboard/products" className="text-haluna-primary text-sm hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {popularProducts.map((product) => (
              <div key={product.id} className="flex items-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gray-100 rounded-md mr-4 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-haluna-text-light">${product.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{product.sales} sales</p>
                  <p className="text-xs text-haluna-text-light">In stock ({product.stock})</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Sales Growth</h2>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">+18.2% YTD</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-haluna-text-light">Target</span>
              <span className="text-sm font-medium">$5,000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-haluna-text-light">Current: $3,521</span>
              <span className="text-xs text-haluna-text-light">70% completed</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-haluna-text-light">Last month</span>
              <span>$4,024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-haluna-text-light">This month (MTD)</span>
              <span>$3,521</span>
            </div>
            <div className="flex justify-between">
              <span className="text-haluna-text-light">Projected</span>
              <span>$5,150</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
