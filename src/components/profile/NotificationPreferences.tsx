
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  getNotificationPreferences, 
  updateNotificationPreferences, 
  requestNotificationPermission,
  checkNotificationSupport,
  sendTestNotification,
  type NotificationPreferences as NotificationPreferencesType
} from '@/services/notificationService';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultPreferences: NotificationPreferencesType = {
  orders: true,
  marketing: false,
  product_updates: true,
  reviews: true,
  messages: true,
  new_orders: true,
  low_stock: true,
  customer_reviews: true,
  sales_reports: true,
};

const NotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferencesType>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [saving, setSaving] = useState(false);

  // Check notification support and permission status
  useEffect(() => {
    const checkSupport = async () => {
      if (!checkNotificationSupport()) {
        setPermissionStatus('unsupported');
        return;
      }

      setPermissionStatus(Notification.permission);
    };

    checkSupport();
  }, []);

  // Load user's notification preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;

      setLoading(true);
      const userPrefs = await getNotificationPreferences(user.id);
      
      if (userPrefs) {
        setPreferences(userPrefs);
      }
      
      setLoading(false);
    };

    loadPreferences();
  }, [user]);

  // Handle permission request
  const handleRequestPermission = async () => {
    try {
      const permission = await requestNotificationPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive notifications from Halvi.",
          variant: "default",
        });
      } else if (permission === 'denied') {
        toast({
          title: "Notifications denied",
          description: "You'll need to enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission request failed",
        description: "There was an error requesting notification permission.",
        variant: "destructive",
      });
    }
  };

  // Handle preference changes
  const handlePreferenceChange = (key: keyof NotificationPreferencesType) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Save preferences
  const savePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    const success = await updateNotificationPreferences(user.id, preferences);
    
    if (success) {
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
        variant: "default",
      });
    } else {
      toast({
        title: "Error saving preferences",
        description: "There was an error saving your notification preferences.",
        variant: "destructive",
      });
    }
    
    setSaving(false);
  };

  // Handle test notification
  const handleTestNotification = () => {
    sendTestNotification();
  };

  if (loading) {
    return <div className="flex justify-center py-8">Loading preferences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" /> Notification Preferences
        </CardTitle>
        <CardDescription>
          Manage how and when Halvi sends you notifications.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="rounded-lg border p-4 mb-6">
          {permissionStatus === 'unsupported' ? (
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Your browser doesn't support notifications</p>
                <p className="text-sm text-muted-foreground">Try using a different browser to receive notifications.</p>
              </div>
            </div>
          ) : permissionStatus === 'granted' ? (
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Notifications are enabled</p>
                <p className="text-sm text-muted-foreground">You'll receive notifications based on your preferences below.</p>
              </div>
            </div>
          ) : permissionStatus === 'denied' ? (
            <div className="flex items-center gap-3 text-destructive">
              <BellOff className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Notifications are blocked</p>
                <p className="text-sm text-muted-foreground">You'll need to enable notifications in your browser settings.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Notifications need permission</p>
                  <p className="text-sm text-muted-foreground">Allow notifications to stay updated with your orders and activity.</p>
                </div>
              </div>
              <Button onClick={handleRequestPermission} className="mt-2">
                Enable Notifications
              </Button>
            </div>
          )}
        </div>
        
        {/* General Notifications (for all users) */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">General Notifications</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Order Updates</h4>
                <p className="text-sm text-muted-foreground">Receive updates about your orders</p>
              </div>
              <Switch 
                checked={preferences.orders} 
                onCheckedChange={() => handlePreferenceChange('orders')} 
                disabled={permissionStatus !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Messages</h4>
                <p className="text-sm text-muted-foreground">Receive messages from sellers</p>
              </div>
              <Switch 
                checked={preferences.messages} 
                onCheckedChange={() => handlePreferenceChange('messages')} 
                disabled={permissionStatus !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Product Updates</h4>
                <p className="text-sm text-muted-foreground">Get notified about new products from shops you follow</p>
              </div>
              <Switch 
                checked={preferences.product_updates} 
                onCheckedChange={() => handlePreferenceChange('product_updates')} 
                disabled={permissionStatus !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Review Responses</h4>
                <p className="text-sm text-muted-foreground">Get notified when someone responds to your review</p>
              </div>
              <Switch 
                checked={preferences.reviews} 
                onCheckedChange={() => handlePreferenceChange('reviews')} 
                disabled={permissionStatus !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing & Promotions</h4>
                <p className="text-sm text-muted-foreground">Receive deals, discounts and promotional messages</p>
              </div>
              <Switch 
                checked={preferences.marketing} 
                onCheckedChange={() => handlePreferenceChange('marketing')} 
                disabled={permissionStatus !== 'granted'}
              />
            </div>
          </div>
        </div>
        
        {/* Business Owner Notifications */}
        {user?.role === 'business' && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Business Notifications</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">New Orders</h4>
                  <p className="text-sm text-muted-foreground">Get notified when you receive new orders</p>
                </div>
                <Switch 
                  checked={preferences.new_orders} 
                  onCheckedChange={() => handlePreferenceChange('new_orders')} 
                  disabled={permissionStatus !== 'granted'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Low Stock Alerts</h4>
                  <p className="text-sm text-muted-foreground">Get notified when your products are running low</p>
                </div>
                <Switch 
                  checked={preferences.low_stock} 
                  onCheckedChange={() => handlePreferenceChange('low_stock')} 
                  disabled={permissionStatus !== 'granted'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Customer Reviews</h4>
                  <p className="text-sm text-muted-foreground">Get notified when customers leave reviews</p>
                </div>
                <Switch 
                  checked={preferences.customer_reviews} 
                  onCheckedChange={() => handlePreferenceChange('customer_reviews')} 
                  disabled={permissionStatus !== 'granted'}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sales Reports</h4>
                  <p className="text-sm text-muted-foreground">Receive periodic sales performance reports</p>
                </div>
                <Switch 
                  checked={preferences.sales_reports} 
                  onCheckedChange={() => handlePreferenceChange('sales_reports')} 
                  disabled={permissionStatus !== 'granted'}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Test Notification */}
        {permissionStatus === 'granted' && (
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleTestNotification} 
              className="w-full"
            >
              Send Test Notification
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <p className="text-sm text-muted-foreground">
          You can change these settings at any time.
        </p>
        <Button 
          onClick={savePreferences} 
          disabled={saving || permissionStatus !== 'granted'}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationPreferences;
