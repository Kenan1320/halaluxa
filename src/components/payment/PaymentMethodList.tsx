
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/models/shop';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CreditCard, Trash2, CheckCircle, Edit2, DollarSign as DollarSignIcon, Banknote as BanknoteIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PaymentMethodListProps {
  onEdit: (method: PaymentMethod) => void;
  onMethodsChange: () => void;
}

export default function PaymentMethodList({ onEdit, onMethodsChange }: PaymentMethodListProps) {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    fetchMethods();
  }, [user]);
  
  const fetchMethods = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const paymentMethods = await getPaymentMethods(user.id);
      setMethods(paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      const success = await deletePaymentMethod(id, user.id);
      if (success) {
        toast.success('Payment method removed successfully');
        fetchMethods();
        onMethodsChange();
      } else {
        toast.error('Failed to remove payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('An error occurred while removing payment method');
    }
    
    setMethodToDelete(null);
  };
  
  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      const success = await setDefaultPaymentMethod(id, user.id);
      if (success) {
        toast.success('Default payment method updated');
        fetchMethods();
        onMethodsChange();
      } else {
        toast.error('Failed to update default payment method');
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('An error occurred while updating default payment method');
    }
  };
  
  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method.paymentType) {
      case 'card':
        return <CreditCard className="h-6 w-6 text-primary" />;
      case 'paypal':
        return (
          <div className="bg-[#0070BA] text-white p-1 rounded-full h-6 w-6 flex items-center justify-center">
            <span className="font-bold text-xs">P</span>
          </div>
        );
      case 'applepay':
        return (
          <div className="bg-black text-white p-1 rounded-full h-6 w-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 17a6 6 0 0 0 5.8-4M15 9a6 6 0 0 0-5.8 4" />
              <path d="M17 9.3c-.5-.1-1.6-.2-2 .3-.5.7 1-.5 1-1 0-1-.2-1.3-.4-1.7a2 2 0 0 0-2.9-.3c-.2.2-.3.5-.3.800 0 .7 1.2 1 2 1.4.8.2 2 .5 2 1.5s-1 1.7-2 1.7c-.5 0-2 0-2-2"/>
            </svg>
          </div>
        );
      case 'googlepay':
        return (
          <div className="bg-[#4285F4] text-white p-1 rounded-full h-6 w-6 flex items-center justify-center">
            <span className="font-bold text-xs">G</span>
          </div>
        );
      default:
        return <DollarSignIcon className="h-6 w-6 text-primary" />;
    }
  };
  
  const getPaymentLabel = (method: PaymentMethod) => {
    switch (method.paymentType) {
      case 'card':
        return `${method.cardBrand.toUpperCase()} •••• ${method.cardLastFour}`;
      case 'paypal':
        return 'PayPal';
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
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center justify-between border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24 mt-2" />
              </div>
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>
    );
  }
  
  if (methods.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BanknoteIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No payment methods found</h3>
        <p className="text-gray-500 mb-6">Add a payment method to make purchases faster</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {methods.map((method) => (
        <div key={method.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              {getPaymentIcon(method)}
            </div>
            <div>
              <div className="flex items-center">
                <p className="font-medium">{getPaymentLabel(method)}</p>
                {method.isDefault && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">Added on {new Date(method.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!method.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSetDefault(method.id)}
                className="text-xs"
              >
                Set as Default
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(method)}
              className="text-xs"
            >
              <Edit2 className="h-3.5 w-3.5 mr-1" />
              Edit
            </Button>
            
            <AlertDialog open={methodToDelete === method.id} onOpenChange={(open) => !open && setMethodToDelete(null)}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs"
                  onClick={() => setMethodToDelete(method.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove payment method</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove this payment method from your account. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(method.id)} className="bg-red-500 hover:bg-red-600">
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
