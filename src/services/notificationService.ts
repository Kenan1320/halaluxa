
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define the notification types
export type NotificationType = 
  // Shopper notifications
  | 'order_update'
  | 'product_recommendation'
  | 'abandoned_cart'
  | 'new_product'
  // Business notifications
  | 'new_order'
  | 'low_stock'
  | 'customer_message'
  | 'sales_summary'
  | 'new_review';

export interface NotificationPreferences {
  // Shopper preferences
  orders: boolean;
  marketing: boolean;
  product_updates: boolean;
  reviews: boolean;
  messages: boolean;
  
  // Business preferences
  new_orders?: boolean;
  low_stock?: boolean;
  customer_reviews?: boolean;
  sales_reports?: boolean;
  
  user_id: string;
}

// Get app default notification settings
export const getAppNotificationSettings = async (): Promise<any> => {
  try {
    // This would normally fetch from a settings table
    // For now, return default values
    return {
      notifications_enabled: true,
      default_settings: {
        orders: true,
        marketing: true,
        product_updates: true,
        reviews: true,
        messages: true,
        new_orders: true,
        low_stock: true,
        customer_reviews: true,
        sales_reports: true
      }
    };
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return null;
  }
};

// Save push subscription for a user
export const saveUserPushSubscription = async (userId: string, subscription: PushSubscriptionJSON): Promise<boolean> => {
  try {
    // In a real implementation, you would store this in the database
    console.log('Saving subscription for user:', userId, subscription);
    localStorage.setItem(`push_sub_${userId}`, JSON.stringify(subscription));
    return true;
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return false;
  }
};

// Save or update user notification preferences
export const saveNotificationPreferences = async (preferences: NotificationPreferences): Promise<boolean> => {
  try {
    // In a real implementation, you would store this in the database
    console.log('Saving notification preferences:', preferences);
    localStorage.setItem(`notification_prefs_${preferences.user_id}`, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    return false;
  }
};

// Get user notification preferences
export const getUserNotificationPreferences = async (userId: string): Promise<NotificationPreferences | null> => {
  try {
    // In a real implementation, you would fetch from the database
    const savedPrefs = localStorage.getItem(`notification_prefs_${userId}`);
    if (savedPrefs) {
      return JSON.parse(savedPrefs) as NotificationPreferences;
    }
    
    // Return default preferences if none are saved
    return {
      orders: true,
      marketing: false,
      product_updates: true,
      reviews: true,
      messages: true,
      user_id: userId
    };
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return null;
  }
};

// Send a notification to a user (in a real app, this would connect to a push service)
export const sendNotification = async (userId: string, title: string, body: string, data: any = {}): Promise<boolean> => {
  // This is a mock implementation that just shows a toast
  toast(title, {
    description: body,
    duration: 5000
  });
  
  console.log('Notification sent to user:', userId, { title, body, data });
  return true;
};

// For business owners - send an order notification
export const sendOrderNotification = async (businessId: string, orderId: string, orderAmount: number): Promise<boolean> => {
  return sendNotification(
    businessId,
    'New Order Received!',
    `You have received a new order #${orderId} for $${orderAmount.toFixed(2)}`,
    { orderId, type: 'new_order' }
  );
};

// For shoppers - send order status update
export const sendOrderStatusUpdate = async (userId: string, orderId: string, status: string): Promise<boolean> => {
  return sendNotification(
    userId,
    'Order Status Updated',
    `Your order #${orderId} is now ${status}`,
    { orderId, status, type: 'order_update' }
  );
};

// For business owners - send low stock alert
export const sendLowStockAlert = async (businessId: string, productId: string, productName: string, currentStock: number): Promise<boolean> => {
  return sendNotification(
    businessId,
    'Low Stock Alert',
    `${productName} is running low (${currentStock} remaining)`,
    { productId, currentStock, type: 'low_stock' }
  );
};

// For shoppers - send product recommendation
export const sendProductRecommendation = async (userId: string, productId: string, productName: string): Promise<boolean> => {
  return sendNotification(
    userId,
    'Recommended for You',
    `We think you'll like ${productName}`,
    { productId, type: 'product_recommendation' }
  );
};

export type PushSubscriptionJSON = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};
