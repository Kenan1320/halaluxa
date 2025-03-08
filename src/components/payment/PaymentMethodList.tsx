
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod, PaymentMethod } from '@/services/paymentMethodService';
import { CreditCard, Trash2, CheckCircle, Edit2, CircleDollarSign, Banknote as BanknotesIcon } from 'lucide-react';

// PaymentMethodList component
const PaymentMethodList = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const methods = await getPaymentMethods(user.id);
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

  const handleSetDefault = async (methodId: string) => {
    if (!user) return;
    
    try {
      const success = await setDefaultPaymentMethod(methodId, user.id);
      if (success) {
        toast({
          title: 'Success',
          description: 'Default payment method updated',
        });
        loadPaymentMethods();
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

  const handleDelete = async (methodId: string) => {
    if (!user) return;
    
    try {
      const success = await deletePaymentMethod(methodId, user.id);
      if (success) {
        toast({
          title: 'Success',
          description: 'Payment method removed',
        });
        loadPaymentMethods();
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

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-6 w-6 text-haluna-primary" />;
      case 'paypal':
        return <CircleDollarSign className="h-6 w-6 text-blue-500" />;
      case 'applepay':
        return <BanknotesIcon className="h-6 w-6 text-black" />;
      case 'googlepay':
        return <BanknotesIcon className="h-6 w-6 text-red-500" />;
      default:
        return <CreditCard className="h-6 w-6 text-haluna-primary" />;
    }
  };

  const formatPaymentMethodName = (method: PaymentMethod) => {
    switch (method.paymentType) {
      case 'card':
        return `${method.cardBrand} •••• ${method.cardLastFour}`;
      case 'paypal':
        return 'PayPal Account';
      case 'applepay':
        return 'Apple Pay';
      case 'googlepay':
        return 'Google Pay';
      default:
        return 'Payment Method';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 w-40 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
        <p className="text-gray-500 mb-4">
          You haven't added any payment methods yet.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <Card key={method.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {getPaymentIcon(method.paymentType)}
              </div>
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{formatPaymentMethodName(method)}</h3>
                  {method.isDefault && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {method.billingAddress ? `${method.billingAddress}` : 'No billing address'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-700"
                onClick={() => console.log('Edit payment method', method.id)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              {!method.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetDefault(method.id)}
                >
                  Set Default
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(method.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PaymentMethodList;
