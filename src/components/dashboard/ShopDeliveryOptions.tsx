
import { useState } from 'react';
import { 
  Truck, Package, Store, Clock, DollarSign, 
  AlertCircle, CheckCircle, Home
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShopDeliveryOptionsProps {
  initialOptions?: {
    delivery: {
      enabled: boolean;
      fee: number;
      minOrderAmount: number;
      estimatedTime: string;
      freeDeliveryThreshold: number;
      maxDistance: number;
    };
    pickup: {
      enabled: boolean;
      estimatedTime: string;
      store: boolean;
      curbside: boolean;
    };
    groupOrders: {
      enabled: boolean;
      minGroupSize: number;
      discount: number;
    };
  };
  onSave?: (options: any) => Promise<void>;
}

const ShopDeliveryOptions = ({ 
  initialOptions = {
    delivery: {
      enabled: true,
      fee: 2.99,
      minOrderAmount: 10,
      estimatedTime: '30-45',
      freeDeliveryThreshold: 35,
      maxDistance: 5
    },
    pickup: {
      enabled: true,
      estimatedTime: '15-20',
      store: true,
      curbside: false
    },
    groupOrders: {
      enabled: false,
      minGroupSize: 3,
      discount: 10
    }
  },
  onSave
}: ShopDeliveryOptionsProps) => {
  const [options, setOptions] = useState(initialOptions);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleDeliveryToggle = (enabled: boolean) => {
    setOptions(prev => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        enabled
      }
    }));
  };

  const handlePickupToggle = (enabled: boolean) => {
    setOptions(prev => ({
      ...prev,
      pickup: {
        ...prev.pickup,
        enabled
      }
    }));
  };

  const handleGroupOrdersToggle = (enabled: boolean) => {
    setOptions(prev => ({
      ...prev,
      groupOrders: {
        ...prev.groupOrders,
        enabled
      }
    }));
  };

  const handleDeliveryChange = (field: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [field]: value
      }
    }));
  };

  const handlePickupChange = (field: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      pickup: {
        ...prev.pickup,
        [field]: value
      }
    }));
  };

  const handleGroupOrdersChange = (field: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      groupOrders: {
        ...prev.groupOrders,
        [field]: value
      }
    }));
  };

  const handleSaveOptions = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(options);
      toast({
        title: "Options saved",
        description: "Your delivery and pickup options have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving options",
        description: "There was a problem saving your options. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const ServiceToggle = ({ 
    label, 
    enabled, 
    onChange, 
    icon: Icon,
    description
  }: { 
    label: string; 
    enabled: boolean; 
    onChange: (enabled: boolean) => void; 
    icon: any;
    description: string;
  }) => (
    <div className="flex items-start justify-between border-b pb-4 mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Icon className={cn(
            "h-5 w-5", 
            enabled ? "text-green-500" : "text-gray-400"
          )} />
          <h3 className="font-medium">{label}</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <Switch 
        checked={enabled} 
        onCheckedChange={onChange}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Delivery & Pickup Options
        </CardTitle>
        <CardDescription>
          Configure how customers can receive orders from your shop
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Section */}
        <div>
          <ServiceToggle 
            label="Local Delivery" 
            enabled={options.delivery.enabled}
            onChange={handleDeliveryToggle}
            icon={Truck}
            description="Deliver orders directly to customers in your area"
          />

          {options.delivery.enabled && (
            <div className="pl-7 space-y-4 animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    Delivery Fee
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      className="pl-7" 
                      value={options.delivery.fee} 
                      onChange={(e) => handleDeliveryChange('fee', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    Minimum Order
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      className="pl-7" 
                      value={options.delivery.minOrderAmount} 
                      onChange={(e) => handleDeliveryChange('minOrderAmount', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Estimated Time (minutes)
                  </Label>
                  <Input 
                    type="text" 
                    placeholder="30-45" 
                    value={options.delivery.estimatedTime} 
                    onChange={(e) => handleDeliveryChange('estimatedTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Home className="h-4 w-4 text-gray-400" />
                    Max Distance (miles)
                  </Label>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.1"
                    value={options.delivery.maxDistance} 
                    onChange={(e) => handleDeliveryChange('maxDistance', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  Free Delivery Threshold
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    className="pl-7" 
                    value={options.delivery.freeDeliveryThreshold} 
                    onChange={(e) => handleDeliveryChange('freeDeliveryThreshold', parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Orders above this amount qualify for free delivery. Set to 0 to disable.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Pickup Section */}
        <div>
          <ServiceToggle 
            label="In-Store Pickup" 
            enabled={options.pickup.enabled}
            onChange={handlePickupToggle}
            icon={Store}
            description="Allow customers to pick up orders at your location"
          />

          {options.pickup.enabled && (
            <div className="pl-7 space-y-4 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  Estimated Pickup Time (minutes)
                </Label>
                <Input 
                  type="text" 
                  placeholder="15-20" 
                  value={options.pickup.estimatedTime} 
                  onChange={(e) => handlePickupChange('estimatedTime', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Pickup Options</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={options.pickup.store} 
                      onCheckedChange={(checked) => handlePickupChange('store', checked)}
                      id="store-pickup"
                    />
                    <Label htmlFor="store-pickup" className="text-sm font-normal">
                      In-store pickup
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={options.pickup.curbside} 
                      onCheckedChange={(checked) => handlePickupChange('curbside', checked)}
                      id="curbside-pickup"
                    />
                    <Label htmlFor="curbside-pickup" className="text-sm font-normal">
                      Curbside pickup
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Group Orders Section */}
        <div>
          <ServiceToggle 
            label="Group Orders" 
            enabled={options.groupOrders.enabled}
            onChange={handleGroupOrdersToggle}
            icon={AlertCircle}
            description="Enable group ordering with special discounts"
          />

          {options.groupOrders.enabled && (
            <div className="pl-7 space-y-4 animate-in fade-in-50 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Group Size</Label>
                  <Input 
                    type="number" 
                    min="2" 
                    value={options.groupOrders.minGroupSize} 
                    onChange={(e) => handleGroupOrdersChange('minGroupSize', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Group Discount (%)</Label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={options.groupOrders.discount} 
                    onChange={(e) => handleGroupOrdersChange('discount', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSaveOptions}
            disabled={isSaving}
            className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center gap-2 ${
              isSaving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Options'
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopDeliveryOptions;
