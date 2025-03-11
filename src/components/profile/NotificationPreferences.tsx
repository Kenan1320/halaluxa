
import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";

// Define the notification preferences type
export interface NotificationPreferences {
  orderUpdates: boolean;
  newArrivals: boolean;
  discounts: boolean;
  accountActivity: boolean;
  marketing: boolean; // Added missing marketing property
}

const NotificationPreferences: React.FC = () => {
  // Initialize with default values
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    newArrivals: true,
    discounts: true,
    accountActivity: true,
    marketing: false // Added missing marketing property
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // In a real app, this would send the preferences to an API
    console.log("Saving notification preferences:", preferences);
    
    // Reset to default values (all off) for this example when "Reset to defaults" is clicked
    // Added missing marketing property
    setPreferences({ 
      orderUpdates: false,
      newArrivals: false,
      discounts: false,
      accountActivity: false,
      marketing: false
    });
    
    // Show success message
    toast.success("Notification preferences updated!");
  };

  const handleReset = () => {
    // Reset to default values
    setPreferences({
      orderUpdates: true,
      newArrivals: true,
      discounts: true,
      accountActivity: true,
      marketing: false
    });
    
    // Show success message - fix by adding second parameter (which is options)
    toast("Preferences reset to defaults", { 
      description: "Your notification settings have been reset"
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Manage how and when you receive notifications from Halvi.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="orderUpdates" className="flex-1">Order Updates</Label>
          <Switch 
            id="orderUpdates" 
            checked={preferences.orderUpdates} 
            onCheckedChange={() => handleToggle('orderUpdates')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="newArrivals" className="flex-1">New Arrivals</Label>
          <Switch 
            id="newArrivals" 
            checked={preferences.newArrivals} 
            onCheckedChange={() => handleToggle('newArrivals')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="discounts" className="flex-1">Deals & Discounts</Label>
          <Switch 
            id="discounts" 
            checked={preferences.discounts} 
            onCheckedChange={() => handleToggle('discounts')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="accountActivity" className="flex-1">Account Activity</Label>
          <Switch 
            id="accountActivity" 
            checked={preferences.accountActivity} 
            onCheckedChange={() => handleToggle('accountActivity')}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="marketing" className="flex-1">Marketing & Promotions</Label>
          <Switch 
            id="marketing" 
            checked={preferences.marketing} 
            onCheckedChange={() => handleToggle('marketing')}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationPreferences;
