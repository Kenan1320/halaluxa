
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Clock, MapPin, Edit, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CAR_COLORS = [
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Black', hex: '#000000' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Gray', hex: '#808080' },
];

interface PickupNotificationProps {
  orderId: string;
  shopId: string;
  onComplete: () => void;
}

const PickupNotification: React.FC<PickupNotificationProps> = ({ 
  orderId, 
  shopId,
  onComplete 
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'initial' | 'car-color' | 'confirm' | 'success'>('initial');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState<string>('');
  const [parkingSpot, setParkingSpot] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleArriveClick = () => {
    setStep('car-color');
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor('');
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setSelectedColor(null);
  };

  const handleContinue = () => {
    if (!selectedColor && !customColor) {
      toast({
        title: "Color required",
        description: "Please select or enter your car color",
        variant: "destructive"
      });
      return;
    }
    setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'car-color') {
      setStep('initial');
    } else if (step === 'confirm') {
      setStep('car-color');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const finalColor = selectedColor || customColor;
      
      // Update the order in the database
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'ready',
          pickup_details: {
            car_color: finalColor,
            arrival_time: new Date().toISOString(),
            parking_spot: parkingSpot,
            notes: notes
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Create a notification for the shop
      await supabase
        .from('notifications')
        .insert({
          user_id: shopId, // shop owner will receive this
          title: 'Customer has arrived',
          message: `Order #${orderId}: Customer has arrived in a ${finalColor} car${parkingSpot ? ` at spot ${parkingSpot}` : ''}`,
          type: 'pickup_arrival',
          read: false,
          data: {
            order_id: orderId,
            car_color: finalColor,
            parking_spot: parkingSpot,
            notes: notes
          }
        });
        
      // Success!
      setStep('success');
      
      toast({
        title: "Arrival notification sent!",
        description: "The shop has been notified of your arrival",
      });
      
      // Set a timeout to call onComplete
      setTimeout(() => {
        onComplete();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting pickup notification:', error);
      toast({
        title: "Failed to send notification",
        description: "Please try again or contact the shop directly",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto"
      >
        {step === 'initial' && (
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/50">
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Pickup Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="text-center space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Car className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">Your order is ready for pickup!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Let the shop know when you've arrived by clicking the button below.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                onClick={handleArriveClick} 
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                I've Arrived
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'car-color' && (
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">What color is your car?</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {CAR_COLORS.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleColorSelect(color.name)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
                      selectedColor === color.name ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                    } ${color.border ? 'border border-gray-300' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className={`h-6 w-6 ${color.name === 'White' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="custom-color" className="block text-sm font-medium mb-1">
                    Other color
                  </label>
                  <Input
                    id="custom-color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    placeholder="e.g. Burgundy, Beige, etc."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="parking-spot" className="block text-sm font-medium mb-1">
                    Parking spot (optional)
                  </label>
                  <Input
                    id="parking-spot"
                    value={parkingSpot}
                    onChange={(e) => setParkingSpot(e.target.value)}
                    placeholder="e.g. A-12, Near entrance"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1">
                    Additional notes (optional)
                  </label>
                  <Input
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Waiting in passenger seat"
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                onClick={handleContinue} 
                className="w-full"
                disabled={!selectedColor && !customColor}
              >
                Continue
              </Button>
              <Button 
                onClick={handleBack} 
                variant="outline" 
                className="w-full"
              >
                Back
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'confirm' && (
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Confirm Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Car Color</h4>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{selectedColor || customColor}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setStep('car-color')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {parkingSpot && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Parking Spot</h4>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{parkingSpot}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => setStep('car-color')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {notes && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Additional Notes</h4>
                    <p className="text-sm">{notes}</p>
                  </div>
                )}
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Once confirmed, the shop will be notified of your arrival and they'll bring your order to your car.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Notifying shop...' : 'Confirm Arrival'}
              </Button>
              <Button 
                onClick={handleBack} 
                variant="outline" 
                className="w-full"
                disabled={isSubmitting}
              >
                Back
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 'success' && (
          <Card>
            <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/50">
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Notification Sent
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="text-center space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium">Thank you!</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  The shop has been notified of your arrival. They'll bring your order out shortly.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PickupNotification;
