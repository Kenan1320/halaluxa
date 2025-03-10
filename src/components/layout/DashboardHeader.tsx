
import React, { useState, useEffect } from 'react';
import { Menu, MoreVertical, Search, Settings, LogOut, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getBusinessNotifications, markNotificationAsRead } from '@/services/paymentService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface DashboardHeaderProps {}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      const notificationData = await getBusinessNotifications(user.id);
      setNotifications(notificationData);
      setUnreadCount(notificationData.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };
  
  useEffect(() => {
    loadNotifications();
    
    // Set up interval to refresh notifications
    const intervalId = setInterval(loadNotifications, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  const handleNotificationClick = async (notification: any) => {
    // Mark notification as read
    try {
      await markNotificationAsRead(notification.id);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      
      // Navigate or perform action based on notification type
      if (notification.type === 'new_order') {
        toast({
          title: "Order Details",
          description: `Viewing details for order ${notification.metadata?.orderId}`,
        });
        
        // In a real app, this would navigate to the order details page
        // navigate(`/dashboard/orders/${notification.metadata?.orderId}`);
      } else if (notification.type === 'customer_arriving') {
        toast({
          title: "Customer Arriving",
          description: `A customer will arrive soon ${notification.metadata?.vehicleColor ? `in a ${notification.metadata.vehicleColor} car` : ''}`,
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <DropdownMenuItem 
              key={notification.id}
              className={`flex flex-col items-start py-3 ${!notification.read ? 'bg-blue-50' : ''}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between w-full">
                <span className="font-medium">{notification.title}</span>
                {!notification.read && <Badge variant="secondary" className="ml-2">New</Badge>}
              </div>
              <span className="text-sm text-muted-foreground mt-1">{notification.message}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(notification.created_at).toLocaleString()}
              </span>
            </DropdownMenuItem>
          ))
        )}
        
        {notifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    localStorage.setItem('dashboardViewMode', sidebarOpen ? 'mobile' : 'desktop');
    window.dispatchEvent(new Event('storage'));
  };
  
  return (
    <header className="bg-white h-16 flex items-center justify-between px-4 border-b sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="hidden md:flex relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full bg-gray-100 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-haluna-primary/50"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <NotificationCenter />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-haluna-primary text-white flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
              <Settings size={16} className="mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
