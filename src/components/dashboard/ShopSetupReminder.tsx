
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ShopSetupReminderProps {
  onDismiss?: () => void;
}

const ShopSetupReminder: React.FC<ShopSetupReminderProps> = ({ onDismiss }) => {
  const navigate = useNavigate();
  
  const handleSetupShop = () => {
    navigate('/dashboard/settings');
  };
  
  return (
    <Card className="shadow-lg border-haluna-primary/20 bg-gradient-to-br from-white to-haluna-primary/5">
      <CardHeader className="pb-2">
        <div className="w-12 h-12 rounded-full bg-haluna-primary/10 flex items-center justify-center mb-4">
          <Store className="h-6 w-6 text-haluna-primary" />
        </div>
        <CardTitle className="text-xl">Complete Your Shop Setup</CardTitle>
        <CardDescription>
          You haven't set up your shop details yet. Complete your profile to start selling.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>A complete shop profile helps customers find and trust your business.</p>
        <p>Add details like:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Shop name and description</li>
          <li>Logo and banner images</li>
          <li>Location and contact information</li>
          <li>Business hours</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {onDismiss && (
          <Button variant="ghost" onClick={onDismiss}>
            Remind me later
          </Button>
        )}
        <Button className="bg-haluna-primary hover:bg-haluna-primary/90" onClick={handleSetupShop}>
          Set Up Shop <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopSetupReminder;
