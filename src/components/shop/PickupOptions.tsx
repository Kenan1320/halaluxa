
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Car, Store } from 'lucide-react';
import { updatePickupStatus } from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';

interface PickupOptionsProps {
  orderId: string;
  onComplete: () => void;
}

const PickupOptions: React.FC<PickupOptionsProps> = ({ orderId, onComplete }) => {
  const [pickupType, setPickupType] = useState<'in_store' | 'curbside'>('in_store');
  const [vehicleColor, setVehicleColor] = useState('');
  const [notifying, setNotifying] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setNotifying(true);
      
      // Update the order with pickup preferences
      const success = await updatePickupStatus(
        orderId,
        'arriving',
        pickupType === 'curbside' ? vehicleColor : undefined
      );
      
      if (success) {
        toast({
          title: "Notification Sent",
          description: pickupType === 'in_store' 
            ? "The store has been notified that you'll arrive in 2 minutes" 
            : `The store has been notified that you'll arrive in 2 minutes in a ${vehicleColor} car`,
        });
        onComplete();
      } else {
        throw new Error("Failed to notify store");
      }
    } catch (error) {
      console.error('Error updating pickup status:', error);
      toast({
        title: "Error",
        description: "Failed to send notification to store",
        variant: "destructive",
      });
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Pickup Options</h3>
      
      <form onSubmit={handleSubmit}>
        <RadioGroup 
          value={pickupType} 
          onValueChange={(value) => setPickupType(value as 'in_store' | 'curbside')}
          className="space-y-4 mb-6"
        >
          <div className="flex items-start space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="in_store" id="in_store" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="in_store" className="flex items-center text-base font-medium">
                <Store className="mr-2 h-5 w-5 text-haluna-primary" />
                In-Store Pickup
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Come inside the store to pick up your order at the counter
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="curbside" id="curbside" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="curbside" className="flex items-center text-base font-medium">
                <Car className="mr-2 h-5 w-5 text-haluna-primary" />
                Curbside Pickup
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Wait in your car and the store will bring your order out to you
              </p>
              
              {pickupType === 'curbside' && (
                <div className="mt-3">
                  <Label htmlFor="vehicle-color" className="text-sm font-medium">
                    Vehicle Color
                  </Label>
                  <Input
                    id="vehicle-color"
                    placeholder="e.g. Red Toyota"
                    className="mt-1"
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={notifying || (pickupType === 'curbside' && !vehicleColor)}
        >
          {notifying ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              Notifying Store...
            </>
          ) : (
            "I'm 2 Minutes Away"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PickupOptions;
