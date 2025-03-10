
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Car } from 'lucide-react';

interface PickupOptionsProps {
  pickupType: 'in_store' | 'curbside';
  vehicleColor: string;
  onPickupTypeChange: (type: 'in_store' | 'curbside') => void;
  onVehicleColorChange: (color: string) => void;
}

const PickupOptions: React.FC<PickupOptionsProps> = ({
  pickupType,
  vehicleColor,
  onPickupTypeChange,
  onVehicleColorChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Pickup Method</h3>
        <RadioGroup 
          value={pickupType} 
          onValueChange={(value) => onPickupTypeChange(value as 'in_store' | 'curbside')}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className={`border rounded-lg p-4 ${pickupType === 'in_store' ? 'border-haluna-primary bg-haluna-primary/5' : ''}`}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in_store" id="in_store" />
              <Label htmlFor="in_store" className="flex items-center cursor-pointer">
                <Store className="h-4 w-4 mr-2" />
                <span>In-Store Pickup</span>
              </Label>
            </div>
            {pickupType === 'in_store' && (
              <p className="text-sm text-muted-foreground mt-2 ml-6">
                Come into the store to collect your order from our staff.
              </p>
            )}
          </div>
          
          <div className={`border rounded-lg p-4 ${pickupType === 'curbside' ? 'border-haluna-primary bg-haluna-primary/5' : ''}`}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="curbside" id="curbside" />
              <Label htmlFor="curbside" className="flex items-center cursor-pointer">
                <Car className="h-4 w-4 mr-2" />
                <span>Curbside Pickup</span>
              </Label>
            </div>
            {pickupType === 'curbside' && (
              <p className="text-sm text-muted-foreground mt-2 ml-6">
                Park outside and we'll bring your order to your vehicle.
              </p>
            )}
          </div>
        </RadioGroup>
      </div>
      
      {pickupType === 'curbside' && (
        <div>
          <Label htmlFor="vehicleColor" className="text-sm font-medium mb-2 block">
            Vehicle Description (color, make, model)
          </Label>
          <Input
            id="vehicleColor"
            placeholder="e.g., Red Toyota Camry"
            value={vehicleColor}
            onChange={(e) => onVehicleColorChange(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This helps us identify your vehicle when you arrive
          </p>
        </div>
      )}
      
      <div className="border-t pt-4 mt-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="arrival_notify" />
          <Label htmlFor="arrival_notify" className="text-sm">
            I'll notify when I'm on my way (2 minutes away)
          </Label>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          We'll prepare your order and have it ready for a seamless pickup
        </p>
      </div>
    </div>
  );
};

export default PickupOptions;
