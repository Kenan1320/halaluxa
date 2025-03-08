
import React, { useEffect, useState } from 'react';
import { CreditCard, DollarSign, Banknote, Trash2, CheckCircle, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/models/shop';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PaymentMethodListProps {
  onEdit?: (method: PaymentMethod) => void;
  onMethodsChange?: () => void;
}

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({ onEdit, onMethodsChange }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchPaymentMethods = async () => {
    setIsLoading(true);
    try {
      const methods = await getPaymentMethods();
      setPaymentMethods(methods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment methods',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPaymentMethods();
  }, []);
  
  const handleSetDefault = async (id: string) => {
    try {
      const success = await setDefaultPaymentMethod(id);
      
      if (success) {
        toast({
          title: 'Default payment method updated',
          description: 'Your default payment method has been updated successfully.',
        });
        
        fetchPaymentMethods();
        if (onMethodsChange) onMethodsChange();
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to set default payment method',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const success = await deletePaymentMethod(id);
      
      if (success) {
        toast({
          title: 'Payment method deleted',
          description: 'Your payment method has been deleted successfully.',
        });
        
        setMethodToDelete(null);
        fetchPaymentMethods();
        if (onMethodsChange) onMethodsChange();
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete payment method',
        variant: 'destructive',
      });
    }
  };
  
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-6 w-6" />;
      case 'paypal':
        return <DollarSign className="h-6 w-6" />;
      case 'applepay':
      case 'googlepay':
        return <Banknote className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };
  
  const getPaymentLabel = (method: PaymentMethod) => {
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
        return 'Unknown Payment Method';
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div 
            key={i}
            className="p-4 border rounded-md animate-pulse bg-gray-50 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="ml-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24 mt-2"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">No payment methods added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={`p-4 border rounded-md ${
            method.isDefault ? 'bg-green-50 border-green-200' : 'bg-white'
          } flex items-center justify-between`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              {getPaymentIcon(method.paymentType)}
            </div>
            <div className="ml-3">
              <div className="font-medium flex items-center">
                {getPaymentLabel(method)}
                {method.isDefault && (
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Default
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Added on {new Date(method.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!method.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetDefault(method.id)}
                title="Set as default"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only">Set as default</span>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit && onEdit(method)}
              title="Edit"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMethodToDelete(method.id)}
              title="Delete"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
      
      <AlertDialog open={!!methodToDelete} onOpenChange={() => setMethodToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment method from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => methodToDelete && handleDelete(methodToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentMethodList;
