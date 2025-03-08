
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getPaymentMethods, setDefaultPaymentMethod, deletePaymentMethod } from '@/services/paymentMethodService';
import { PaymentMethod } from '@/models/shop';
import { Card, Trash2, Edit, CreditCard, DollarSign, Banknote } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

// Add props for onEdit and onMethodsChange
interface PaymentMethodListProps {
  onEdit?: (method: PaymentMethod) => void;
  onMethodsChange?: () => void;
}

const PaymentMethodList = ({ onEdit, onMethodsChange }: PaymentMethodListProps) => {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (!user) return;
    loadPaymentMethods();
  }, [user]);

  const loadPaymentMethods = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const paymentMethods = await getPaymentMethods(user.id);
      setMethods(paymentMethods);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (methodId: string) => {
    if (!user) return;
    
    setProcessing(methodId);
    try {
      await setDefaultPaymentMethod(methodId, user.id);
      setMethods(prevMethods => prevMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      })));
      toast.success('Default payment method updated');
      if (onMethodsChange) onMethodsChange();
    } catch (error) {
      console.error('Error setting default method:', error);
      toast.error('Failed to update default payment method');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async () => {
    if (!methodToDelete || !user) return;
    
    setDeleting(methodToDelete.id);
    try {
      await deletePaymentMethod(methodToDelete.id, user.id);
      setMethods(prevMethods => prevMethods.filter(method => method.id !== methodToDelete.id));
      toast.success('Payment method removed');
      setIsDialogOpen(false);
      if (onMethodsChange) onMethodsChange();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to remove payment method');
    } finally {
      setDeleting(null);
      setMethodToDelete(null);
    }
  };

  const confirmDelete = (method: PaymentMethod) => {
    setMethodToDelete(method);
    setIsDialogOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    if (onEdit) onEdit(method);
  };

  const getCardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'paypal':
        return <DollarSign className="h-5 w-5" />;
      case 'applepay':
      case 'googlepay':
        return <Banknote className="h-5 w-5" />;
      default:
        return <Card className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <Card className="h-10 w-10 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500 mb-4">No payment methods added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {methods.map(method => (
        <div 
          key={method.id}
          className={`p-4 rounded-lg border ${method.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200'} transition-colors`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-full border border-gray-100 mr-3">
                {getCardIcon(method.paymentType)}
              </div>
              <div>
                <p className="font-medium">
                  {method.paymentType === 'card' 
                    ? `•••• ${method.cardLastFour}`
                    : method.paymentType.charAt(0).toUpperCase() + method.paymentType.slice(1)}
                </p>
                {method.paymentType === 'card' && method.cardBrand && (
                  <p className="text-sm text-gray-500 capitalize">{method.cardBrand}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {method.isDefault && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Default
                </span>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!method.isDefault && (
                    <DropdownMenuItem onClick={() => handleSetDefault(method.id)} disabled={!!processing}>
                      Set as default
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleEdit(method)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500" onClick={() => confirmDelete(method)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={!!deleting}
            >
              {deleting ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethodList;
