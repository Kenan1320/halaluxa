
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  CreditCard, 
  BarChart2, 
  LogOut, 
  X
} from 'lucide-react';
import { Shop } from '@/models/shop';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface DashboardSidebarProps {
  shop: Shop;
  onClose: () => void;
}

const DashboardSidebar = ({ shop, onClose }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <NavLink to="/" className="flex items-center">
          <img src="/logo.png" alt="Haluna" className="h-8" />
        </NavLink>
        <button 
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 flex items-center justify-center rounded-full">
            {shop.logo_url ? (
              <img src={shop.logo_url} alt={shop.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-emerald-700 font-semibold">{shop.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-900">{shop.name}</h3>
            <p className="text-xs text-gray-500">{shop.category}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          <NavItem to="/dashboard" icon={<Home size={18} />} label="Dashboard" />
          <NavItem to="/dashboard/products" icon={<Package size={18} />} label="Products" />
          <NavItem to="/dashboard/orders" icon={<ShoppingCart size={18} />} label="Orders" />
          <NavItem to="/dashboard/customers" icon={<Users size={18} />} label="Customers" />
          <NavItem to="/dashboard/analytics" icon={<BarChart2 size={18} />} label="Analytics" />
          <NavItem to="/dashboard/payment-account" icon={<CreditCard size={18} />} label="Payments" />
          <NavItem to="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg w-full hover:bg-gray-100 transition-colors"
        >
          <LogOut size={18} className="mr-2 text-gray-500" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => `
          flex items-center px-3 py-2 text-sm rounded-lg transition-colors
          ${isActive 
            ? 'bg-emerald-50 text-emerald-700 font-medium' 
            : 'text-gray-700 hover:bg-gray-100'}
        `}
        end={to === '/dashboard'}
      >
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mr-2 text-current"
        >
          {icon}
        </motion.div>
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default DashboardSidebar;
