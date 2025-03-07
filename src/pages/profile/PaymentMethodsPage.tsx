
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { CreditCard } from 'lucide-react';
import PaymentMethodList from '@/components/payment/PaymentMethodList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PaymentMethodForm from '@/components/payment/PaymentMethodForm';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/services/paymentMethodService';

const PaymentMethodsPage = () => {
  const { isLoggedIn, user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  return (
    <>
      <Helmet>
        <title>Payment Methods - Haluna</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold">Payment Methods</h1>
            <p className="text-haluna-text-light">Manage your saved payment methods</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
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
                onSuccess={(method: PaymentMethod) => {
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

        <div className="bg-white rounded-xl shadow-sm p-6">
          <PaymentMethodList />
        </div>
      </div>
    </>
  );
};

export default PaymentMethodsPage;
