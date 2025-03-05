
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getSellerAccounts, saveSellerAccount } from '@/services/paymentService';

const PaymentAccountPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
  });
  
  useEffect(() => {
    if (user) {
      // Load existing account data if available
      const accounts = getSellerAccounts();
      const existingAccount = accounts.find(acc => acc.sellerId === user.id);
      
      if (existingAccount) {
        setFormData({
          accountName: existingAccount.accountName,
          accountNumber: existingAccount.accountNumber,
          bankName: existingAccount.bankName,
          routingNumber: '',
        });
      }
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save payment information",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form fields
    if (!formData.accountName || !formData.accountNumber || !formData.bankName) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Save seller account details
      saveSellerAccount({
        sellerId: user.id,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
      });
      
      toast({
        title: "Success",
        description: "Payment account saved successfully",
      });
      
      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving payment account:', error);
      toast({
        title: "Error",
        description: "Failed to save payment account. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-haluna-text">Payment Account</h1>
        <p className="text-haluna-text-light">Set up how you'll receive payments from sales</p>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-haluna-text mb-1">
              Bank Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Building className="h-5 w-5 text-haluna-text-light" />
              </div>
              <input
                type="text"
                id="bankName"
                name="bankName"
                placeholder="Enter your bank name"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2.5 pl-10 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-haluna-text mb-1">
              Account Holder Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-haluna-text-light" />
              </div>
              <input
                type="text"
                id="accountName"
                name="accountName"
                placeholder="Enter account holder name"
                value={formData.accountName}
                onChange={handleChange}
                className="w-full border rounded-lg p-2.5 pl-10 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-haluna-text mb-1">
              Account Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CreditCard className="h-5 w-5 text-haluna-text-light" />
              </div>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                placeholder="Enter your account number"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full border rounded-lg p-2.5 pl-10 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="routingNumber" className="block text-sm font-medium text-haluna-text mb-1">
              Routing Number (if applicable)
            </label>
            <input
              type="text"
              id="routingNumber"
              name="routingNumber"
              placeholder="Enter routing number"
              value={formData.routingNumber}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm">
            <p className="text-blue-700 mb-2 font-medium">Important Information:</p>
            <ul className="list-disc list-inside text-blue-600 space-y-1">
              <li>Your bank account information is securely stored</li>
              <li>Payments are processed within 2-3 business days after a sale</li>
              <li>Standard processing fees may apply (typically 2.9% + $0.30)</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Payment Details
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentAccountPage;
