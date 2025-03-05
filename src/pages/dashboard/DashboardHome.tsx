
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the dashboard
const data = [
  { name: 'Jan', sales: 400 },
  { name: 'Feb', sales: 300 },
  { name: 'Mar', sales: 600 },
  { name: 'Apr', sales: 800 },
  { name: 'May', sales: 500 },
  { name: 'Jun', sales: 900 },
  { name: 'Jul', sales: 1100 },
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
      <ArrowUpRight className={cn(
        "h-4 w-4 ml-1",
        positive ? "text-green-600" : "text-red-600"
      )} />
      <span className="text-haluna-text-light text-sm ml-2">vs last month</span>
    </div>
  </div>
);

const DashboardHome = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">Dashboard</h1>
        <p className="text-haluna-text-light">Welcome back to your seller dashboard</p>
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
          change="+5.3%"
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Sales Overview</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border rounded-md bg-haluna-primary-light text-haluna-primary">
              Weekly
            </button>
            <button className="px-3 py-1 text-sm border rounded-md text-haluna-text-light">
              Monthly
            </button>
            <button className="px-3 py-1 text-sm border rounded-md text-haluna-text-light">
              Yearly
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
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
              <Tooltip />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-haluna-primary text-sm hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Order #{1000 + order}</p>
                  <p className="text-sm text-haluna-text-light">3 items • $120.00</p>
                </div>
                <div className="text-right">
                  <p className="inline-block px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700">
                    Processing
                  </p>
                  <p className="text-sm text-haluna-text-light mt-1">
                    Today, 2:30 PM
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium">Popular Products</h2>
            <Link to="/dashboard/products" className="text-haluna-primary text-sm hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((product) => (
              <div key={product} className="flex items-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gray-100 rounded-md mr-4"></div>
                <div className="flex-1">
                  <p className="font-medium">Product Name #{product}</p>
                  <p className="text-sm text-haluna-text-light">$49.99</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">124 sales</p>
                  <p className="text-xs text-haluna-text-light">In stock (15)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
