
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, PaypalIcon, Trash2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  PaymentMethod, 
  getUserPaymentMethods, 
  deletePaymentMethod, 
  setDefaultPaymentMethod 
} from '@/services/paymentMethodService';
import PaymentMethodForm from './PaymentMethodForm';

interface PaymentMethodListProps {
  onSelect?: (paymentMethod: PaymentMethod) => void;
  selectable?: boolean;
}

const PaymentMethodList = ({ onSelect, selectable = false }: PaymentMethodListProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const methods = await getUserPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment methods',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deletePaymentMethod(id);
      if (success) {
        setPaymentMethods(prev => prev.filter(method => method.id !== id));
        toast({
          title: 'Payment method removed',
          description: 'Your payment method has been successfully removed',
        });
      } else {
        throw new Error('Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove payment method',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const success = await setDefaultPaymentMethod(id);
      if (success) {
        // Update the local state to reflect the change
        setPaymentMethods(prev => 
          prev.map(method => ({
            ...method,
            isDefault: method.id === id
          }))
        );
        toast({
          title: 'Default payment method updated',
          description: 'Your default payment method has been updated',
        });
      } else {
        throw new Error('Failed to set default payment method');
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to update default payment method',
        variant: 'destructive',
      });
    }
  };

  const renderPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method.paymentType) {
      case 'card':
        return <CreditCard className="h-6 w-6" />;
      case 'paypal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 11l3-9h6c1.7 0 3 1.3 3 3 0 3.7-3.3 5-7 5H9.4" />
            <path d="M7 11l-2.9 8.2c-.3.8.3 1.8 1.3 1.8H9l1.1-3h8c3.7 0 6-2 6-5 0-1.7-1.3-3-3-3h-2.3" />
          </svg>
        );
      case 'applepay':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M12.5 1C9.8 1 8.5 2.5 7.9 3.6c-.5 1-1 2.5-1 4.1 0 1.4.5 3 1.3 4.1.8 1.1 2.2 2 3.7 2s2-.5 2.7-.9c.4-.2.8-.5 1.2-.5.3 0 .7.2 1.2.5.7.4 1.6.9 2.5.9.9 0 1.7-.3 2.4-.7.8-.5 1.5-1.2 2-2.1-2.3-1.3-2.7-4.3-1.9-6.1.6-1.4 1.6-2.4 2.9-2.9-1-1.4-2.4-2.3-3.7-2.8-.9-.3-1.9-.4-2.7-.4-1.2 0-2.1.4-2.9.8-.5.3-.9.5-1.3.5-.5 0-.9-.3-1.4-.5-.9-.5-1.8-.7-2.8-.7zm8.9 18.3c-.9.9-1.8 1.6-2.9 1.7-1.3 0-1.7-.8-3.2-.8-1.5 0-1.9.8-3.2.8-1.3 0-2.3-.8-3.2-1.7-2.2-2.4-2.4-5.2-2.4-6.7 0-4.2 2.7-6.4 5.4-6.4 1.4 0 2.5.8 3.3.8.8 0 2-.9 3.4-.9 1.2 0 2.5.4 3.3 1 2.6 1.7 2.3 5.7.5 8.2z" />
          </svg>
        );
      case 'googlepay':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M21.5 11.5H12v3h5.4c-.5 2.5-2.7 4.3-5.4 4.3-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.8.5 3.8 1.4l2.1-2.1C16.6 4.6 14.4 3.8 12 3.8c-5 0-9 4-9 9s4 9 9 9c6.2 0 9.5-4.5 9.5-9 0-.4 0-.8-.1-1.3z" />
          </svg>
        );
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPaymentMethodDescription = (method: PaymentMethod) => {
    switch (method.paymentType) {
      case 'card':
        return `${method.cardBrand?.charAt(0).toUpperCase()}${method.cardBrand?.slice(1)} •••• ${method.cardLastFour}`;
      case 'paypal':
        return method.metadata?.email || 'PayPal Account';
      case 'applepay':
        return 'Apple Pay';
      case 'googlepay':
        return 'Google Pay';
      default:
        return 'Unknown payment method';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
            <CardFooter>
              <div className="h-9 bg-gray-200 rounded w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium mb-1">No Payment Methods</h3>
          <p className="text-haluna-text-light mb-4">You haven't added any payment methods yet.</p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Payment Method</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new payment method to your account.
                </DialogDescription>
              </DialogHeader>
              <PaymentMethodForm 
                onSuccess={(method) => {
                  setPaymentMethods(prev => [...prev, method]);
                  setIsAddDialogOpen(false);
                  toast({
                    title: "Payment method added",
                    description: "Your new payment method has been saved"
                  });
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          {paymentMethods.map(method => (
            <Card key={method.id} className={`${method.isDefault ? 'border-haluna-primary' : ''}`}>
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {renderPaymentMethodIcon(method)}
                    {method.paymentType.charAt(0).toUpperCase() + method.paymentType.slice(1)}
                    {method.isDefault && (
                      <span className="bg-haluna-primary-light text-haluna-primary text-xs px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {getPaymentMethodDescription(method)}
                  </CardDescription>
                </div>
                {selectable && onSelect && (
                  <Button 
                    size="sm" 
                    onClick={() => onSelect(method)}
                    variant="outline"
                  >
                    Select
                  </Button>
                )}
              </CardHeader>
              {!selectable && (
                <CardFooter className="flex justify-end space-x-2 pt-2">
                  {!method.isDefault && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleSetDefault(method.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(method.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Add New Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Add a new payment method to your account.
                </DialogDescription>
              </DialogHeader>
              <PaymentMethodForm 
                onSuccess={(method) => {
                  // If the new method is default, update all other methods
                  if (method.isDefault) {
                    setPaymentMethods(prev => 
                      prev.map(m => ({
                        ...m,
                        isDefault: false
                      }))
                    );
                  }
                  setPaymentMethods(prev => [...prev, method]);
                  setIsAddDialogOpen(false);
                  toast({
                    title: "Payment method added",
                    description: "Your new payment method has been saved"
                  });
                }}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default PaymentMethodList;
