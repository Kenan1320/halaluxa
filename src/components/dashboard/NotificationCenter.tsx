
import React, { useState, useEffect } from 'react';
import { Bell, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistance } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  metadata: any;
  order_id: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchNotifications();
    
    // Subscribe to real-time notifications
    const subscription = supabase
      .channel('notifications-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'business_notifications' }, 
        (payload) => {
          // Add the new notification to the list
          setNotifications(prev => [payload.new as Notification, ...prev]);
          
          // Show a toast notification
          toast({
            title: (payload.new as Notification).title,
            description: (payload.new as Notification).message,
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      setNotifications(data as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('business_notifications')
        .update({ read: true })
        .eq('id', id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
      
      if (unreadIds.length === 0) return;
      
      await supabase
        .from('business_notifications')
        .update({ read: true })
        .in('id', unreadIds);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      toast({
        title: "Notifications",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      await supabase
        .from('business_notifications')
        .delete()
        .eq('id', id);
      
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  const getRelativeTime = (timestamp: string) => {
    return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 flex items-center justify-center p-0 text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 md:w-96 bg-white shadow-xl rounded-lg z-50 max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="link" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={40} className="mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y">
                {notifications.map(notification => (
                  <li
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors relative ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div 
                      className="cursor-pointer"
                      onClick={() => {
                        markAsRead(notification.id);
                        // Handle click based on notification type
                        if (notification.type === 'new_order') {
                          window.location.href = `/dashboard/orders/${notification.order_id}`;
                        } else if (notification.type === 'pickup_arriving') {
                          window.location.href = `/dashboard/orders/${notification.order_id}`;
                        }
                      }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {notification.type === 'new_order' ? (
                            <ShoppingBag className="text-blue-500" size={20} />
                          ) : (
                            <Bell className="text-yellow-500" size={20} />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {getRelativeTime(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-3 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
