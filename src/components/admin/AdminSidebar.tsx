
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const AdminSidebar = ({ currentSection, setCurrentSection }: AdminSidebarProps) => {
  const { mode } = useTheme();
  const navigate = useNavigate();
  
  const menuItems = [
    { id: 'overview', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'shops', name: 'Shops', icon: <Store size={20} /> },
    { id: 'products', name: 'Products', icon: <ShoppingBag size={20} /> },
    { id: 'orders', name: 'Orders', icon: <ClipboardList size={20} /> },
    { id: 'users', name: 'Users', icon: <Users size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <aside className={`w-64 shrink-0 border-r ${
      mode === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-1">Halvi Admin</h2>
        <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Platform Management
        </p>
      </div>
      
      <nav className="px-4 pb-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentSection === item.id
                    ? mode === 'dark'
                      ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/30 text-white'
                      : 'bg-gradient-to-r from-blue-50 to-blue-100/70 text-blue-700'
                    : mode === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 px-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              mode === 'dark'
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LogOut size={20} />
            Exit Admin
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
