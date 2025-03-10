
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { saveNotificationPreferences, getNotificationPreferences } from '@/services/notificationService';

// This is just the bare minimum to fix build errors
export interface NotificationPreferences {
  orders: boolean;
  marketing: boolean;
  product_updates: boolean;
  reviews: boolean;
  messages: boolean;
  new_orders?: boolean;
  low_stock?: boolean;
  customer_reviews?: boolean;
  sales_reports?: boolean;
  user_id: string;
}

const NotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orders: true,
    marketing: false,
    product_updates: true,
    reviews: true,
    messages: true,
    new_orders: true,
    low_stock: true,
    customer_reviews: true,
    sales_reports: true,
    user_id: user?.id || ''
  });
  
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  
  // Load notification preferences
  useEffect(() => {
    if (user) {
      const loadPreferences = async () => {
        try {
          const prefs = await getNotificationPreferences(user.id);
          if (prefs) {
            setPreferences(prefs);
          }
        } catch (error) {
          console.error('Failed to load notification preferences:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadPreferences();
    }
  }, [user]);
  
  // Check browser notification support
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission as NotificationPermission);
    } else {
      setPermissionStatus('unsupported');
    }
  }, []);
  
  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  const handleRequestPermissions = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  };
  
  const handleSavePreferences = async () => {
    if (user) {
      try {
        await saveNotificationPreferences(user.id, preferences);
        // Toast success notification
      } catch (error) {
        console.error('Error saving notification preferences:', error);
        // Toast error notification
      }
    }
  };
  
  return (
    <div className="p-6 bg-card rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-medium">Notification Settings</h3>
        {permissionStatus === 'granted' ? (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full flex items-center gap-1">
            <Bell className="h-3 w-3" /> Enabled
          </span>
        ) : (
          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full flex items-center gap-1">
            <BellOff className="h-3 w-3" /> {permissionStatus === 'denied' ? 'Blocked' : permissionStatus === 'unsupported' ? 'Unsupported' : 'Disabled'}
          </span>
        )}
      </div>
      
      {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            Enable browser notifications to receive updates on your orders, messages, and more.
          </p>
          <Button 
            size="sm" 
            onClick={handleRequestPermissions}
            variant="outline"
          >
            Enable Notifications
          </Button>
        </div>
      )}
      
      {/* Shopper Notification Preferences */}
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-medium">Order Updates</h4>
            <p className="text-xs text-muted-foreground">Get notified about status changes to your orders</p>
          </div>
          <Switch 
            checked={preferences.orders} 
            onCheckedChange={(checked) => handlePreferenceChange('orders', checked)} 
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-medium">Marketing & Promotions</h4>
            <p className="text-xs text-muted-foreground">Receive special offers and promotions</p>
          </div>
          <Switch 
            checked={preferences.marketing} 
            onCheckedChange={(checked) => handlePreferenceChange('marketing', checked)} 
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-medium">Product Updates</h4>
            <p className="text-xs text-muted-foreground">Be notified when products you've shown interest in change</p>
          </div>
          <Switch 
            checked={preferences.product_updates} 
            onCheckedChange={(checked) => handlePreferenceChange('product_updates', checked)} 
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-medium">Reviews and Feedback</h4>
            <p className="text-xs text-muted-foreground">Get reminders to leave reviews on purchases</p>
          </div>
          <Switch 
            checked={preferences.reviews} 
            onCheckedChange={(checked) => handlePreferenceChange('reviews', checked)} 
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h4 className="text-sm font-medium">Messages</h4>
            <p className="text-xs text-muted-foreground">Receive notifications about new messages</p>
          </div>
          <Switch 
            checked={preferences.messages} 
            onCheckedChange={(checked) => handlePreferenceChange('messages', checked)} 
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <Button onClick={handleSavePreferences} disabled={loading}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
