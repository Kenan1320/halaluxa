
import { supabase } from '@/integrations/supabase/client';

// Types for notification preferences
export interface NotificationPreferences {
  user_id: string;
  // Customer preferences
  orders: boolean;
  marketing: boolean;
  product_updates: boolean;
  reviews: boolean;
  messages: boolean;
  // Business owner preferences
  new_orders?: boolean;
  low_stock?: boolean;
  customer_reviews?: boolean;
  sales_reports?: boolean;
}

// Types for notifications
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

// Check if browser supports notifications
export const checkNotificationSupport = (): boolean => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!checkNotificationSupport()) return false;
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Get notification preferences for a user
export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    // This is a mock implementation until the actual DB table is set up
    console.log('Fetching notification preferences for user:', userId);
    
    // Return mock data
    return {
      user_id: userId,
      orders: true,
      marketing: false,
      product_updates: true,
      reviews: true,
      messages: true,
      new_orders: true,
      low_stock: true,
      customer_reviews: true,
      sales_reports: true
    };
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return null;
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (
  userId: string, 
  preferences: Partial<NotificationPreferences>
): Promise<boolean> => {
  try {
    // This is a mock implementation until the actual DB table is set up
    console.log('Updating notification preferences for user:', userId, preferences);
    return true;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return false;
  }
};

// Save web push subscription
export const saveSubscription = async (userId: string, subscription: PushSubscription): Promise<boolean> => {
  try {
    // This is a mock implementation until the actual DB table is set up
    console.log('Saving push subscription for user:', userId, subscription);
    return true;
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return false;
  }
};

// Get user notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // This is a mock implementation until the actual DB table is set up
    console.log('Fetching notifications for user:', userId);
    
    // Return mock data
    return [
      {
        id: '1',
        user_id: userId,
        title: 'Order Shipped',
        message: 'Your order #12345 has been shipped',
        type: 'order',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        user_id: userId,
        title: 'New Product',
        message: 'Check out our new arrivals',
        type: 'marketing',
        read: true,
        created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    // This is a mock implementation until the actual DB table is set up
    console.log('Marking notification as read:', notificationId);
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

// Send a notification
export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  data?: any
): Promise<boolean> => {
  try {
    // This is a mock implementation until the actual DB table is set up
    console.log('Sending notification to user:', userId, { title, message, type, data });
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

// Send a test notification
export const sendTestNotification = async (userId: string): Promise<boolean> => {
  return sendNotification(
    userId,
    'Test Notification',
    'This is a test notification from Halvi',
    'test'
  );
};
