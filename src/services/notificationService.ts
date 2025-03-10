
// Types for notification preferences
export interface NotificationPreferences {
  marketing: boolean;
  orderUpdates: boolean;
  newArrivals: boolean;
  discounts: boolean;
  accountActivity: boolean;
}

// Default preferences
export const defaultNotificationPreferences: NotificationPreferences = {
  marketing: true,
  orderUpdates: true,
  newArrivals: true,
  discounts: true,
  accountActivity: true,
};

// Get user notification preferences
export const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences> => {
  // In a real app, this would fetch from the backend
  // For now, return from localStorage or default values
  try {
    const storedPrefs = localStorage.getItem(`notification_prefs_${userId}`);
    if (storedPrefs) {
      return JSON.parse(storedPrefs);
    }
    return defaultNotificationPreferences;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return defaultNotificationPreferences;
  }
};

// Save user notification preferences
export const saveNotificationPreferences = async (
  userId: string,
  preferences: NotificationPreferences
): Promise<boolean> => {
  try {
    // In a real app, this would save to the backend
    // For now, save to localStorage
    localStorage.setItem(`notification_prefs_${userId}`, JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    return false;
  }
};

// Send a notification to the user (simulation for demo)
export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: 'marketing' | 'orderUpdates' | 'newArrivals' | 'discounts' | 'accountActivity'
): Promise<boolean> => {
  try {
    // Check if the user has enabled this notification type
    const prefs = await getNotificationPreferences(userId);
    if (!prefs[type]) {
      console.log(`User has disabled ${type} notifications`);
      return false;
    }
    
    // In a real app, this would send a notification through a service
    console.log(`Notification sent to user ${userId}: ${title} - ${message}`);
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
};

export default {
  getNotificationPreferences,
  saveNotificationPreferences,
  sendNotification,
  defaultNotificationPreferences,
};
