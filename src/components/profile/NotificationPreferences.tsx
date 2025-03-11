
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { saveNotificationPreferences, getNotificationPreferences } from '@/services/notificationService';
import { useAuth } from '@/context/AuthContext';
import { Bell, ShoppingBag, Tag, MessageSquare } from 'lucide-react';
import { NotificationPreferences as NotificationPreferencesType } from '@/services/notificationService';

type PreferenceItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const PreferenceItem = ({ title, description, icon, checked, onCheckedChange }: PreferenceItemProps) => {
  return (
    <div className="flex items-start space-x-4 py-4 border-b border-border last:border-0">
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
};

const NotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferencesType>({
    orderUpdates: false,
    newArrivals: false,
    discounts: false,
    accountActivity: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (user?.id) {
        setIsLoading(true);
        try {
          const userPreferences = await getNotificationPreferences(user.id);
          // only update if we got preferences back
          if (userPreferences) {
            setPreferences(userPreferences);
          }
        } catch (error) {
          console.error("Error fetching notification preferences:", error);
          // Use default preferences
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPreferences();
  }, [user]);

  const handlePreferenceChange = (key: keyof NotificationPreferencesType, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      await saveNotificationPreferences({ 
        ...preferences,
        user_id: user.id 
      });
      
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Notification Preferences</h2>
      <p className="text-muted-foreground">
        Choose which types of notifications you'd like to receive.
      </p>
      
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <PreferenceItem
          title="Order Updates"
          description="Get notified about the status of your orders and deliveries."
          icon={<ShoppingBag className="h-5 w-5" />}
          checked={preferences.orderUpdates}
          onCheckedChange={(checked) => handlePreferenceChange('orderUpdates', checked)}
        />
        
        <PreferenceItem
          title="New Arrivals"
          description="Be the first to know about new products and services."
          icon={<Bell className="h-5 w-5" />}
          checked={preferences.newArrivals}
          onCheckedChange={(checked) => handlePreferenceChange('newArrivals', checked)}
        />
        
        <PreferenceItem
          title="Discounts & Promotions"
          description="Receive notifications about special offers and discounts."
          icon={<Tag className="h-5 w-5" />}
          checked={preferences.discounts}
          onCheckedChange={(checked) => handlePreferenceChange('discounts', checked)}
        />
        
        <PreferenceItem
          title="Account Activity"
          description="Get alerts about important account activities and security updates."
          icon={<MessageSquare className="h-5 w-5" />}
          checked={preferences.accountActivity}
          onCheckedChange={(checked) => handlePreferenceChange('accountActivity', checked)}
        />
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
