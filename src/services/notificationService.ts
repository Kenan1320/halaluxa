
import { supabase } from '@/integrations/supabase/client';

// Check if the browser supports notifications
export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

// Request permission for push notifications
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!checkNotificationSupport()) {
    throw new Error('Push notifications not supported on this browser');
  }
  
  return Notification.requestPermission();
};

// Register push subscription with the backend
export const registerPushSubscription = async (userId: string): Promise<boolean> => {
  try {
    if (!checkNotificationSupport()) {
      console.warn('Push notifications not supported on this browser');
      return false;
    }

    // Get the service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Get the push subscription
    let subscription = await registration.pushManager.getSubscription();
    
    // If no subscription exists, create a new one
    if (!subscription) {
      // Get the public VAPID key from the backend
      const { data: vapidData, error: vapidError } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'vapid_public_key')
        .single();
      
      if (vapidError || !vapidData) {
        console.error('Failed to get VAPID key:', vapidError);
        return false;
      }
      
      // Convert the VAPID key to the format expected by the browser
      const vapidPublicKey = vapidData.value;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      
      // Create a new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    }
    
    // Save the subscription in the database linked to the user
    const { error } = await supabase
      .from('user_push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: JSON.stringify(subscription),
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Failed to save subscription:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error registering push subscription:', error);
    return false;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (userId: string, preferences: NotificationPreferences): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Failed to update notification preferences:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return false;
  }
};

// Get notification preferences
export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      console.error('Failed to get notification preferences:', error);
      return null;
    }
    
    return data as NotificationPreferences;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return null;
  }
};

// Helper function to convert a base64 string to a Uint8Array
// This is needed for the applicationServerKey
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
};

// Notification preferences interface
export interface NotificationPreferences {
  orders: boolean;
  marketing: boolean;
  product_updates: boolean;
  reviews: boolean;
  messages: boolean;
  // For business accounts
  new_orders?: boolean;
  low_stock?: boolean;
  customer_reviews?: boolean;
  sales_reports?: boolean;
}

// Send a test notification
export const sendTestNotification = (): void => {
  if (!('Notification' in window)) {
    alert('This browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification('Halvi Notification Test', {
      body: 'This is a test notification from Halvi',
      icon: '/pwa-icons/icon-192x192.png'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Halvi Notification Test', {
          body: 'This is a test notification from Halvi',
          icon: '/pwa-icons/icon-192x192.png'
        });
      }
    });
  }
};
