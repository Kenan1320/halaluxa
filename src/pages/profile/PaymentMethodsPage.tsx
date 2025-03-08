
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PaymentMethodList from '@/components/payment/PaymentMethodList';
import PaymentMethodForm from '@/components/payment/PaymentMethodForm';
import { PaymentMethod } from '@/models/shop';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function PaymentMethodsPage() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [methodToEdit, setMethodToEdit] = useState<PaymentMethod | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleAddMethodClick = () => {
    setIsEditMode(false);
    setMethodToEdit(null);
    setIsDialogOpen(true);
  };
  
  const handleEditMethod = (method: PaymentMethod) => {
    setIsEditMode(true);
    setMethodToEdit(method);
    setIsDialogOpen(true);
  };
  
  const handleMethodSuccess = () => {
    setIsDialogOpen(false);
    setRefreshKey(prev => prev + 1);
  };
  
  const refreshMethods = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  if (!user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="p-8 text-center">
          <p className="mb-4">Please log in to manage your payment methods.</p>
          <Button>Log In</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payment Methods</h1>
        <Button onClick={handleAddMethodClick} className="flex items-center">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Method
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {isEditMode && methodToEdit ? (
          <PaymentMethodForm 
            existingMethod={methodToEdit} 
            onSuccess={handleMethodSuccess} 
          />
        ) : (
          <PaymentMethodList 
            key={refreshKey}
            onEdit={handleEditMethod}
            onMethodsChange={refreshMethods}
          />
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
          </DialogHeader>
          <PaymentMethodForm 
            existingMethod={isEditMode ? methodToEdit : undefined} 
            onSuccess={handleMethodSuccess} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
