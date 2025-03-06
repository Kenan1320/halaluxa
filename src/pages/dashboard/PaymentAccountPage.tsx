import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Building, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { getSellerAccount, createSellerAccount, SellerAccount } from '@/services/paymentService';

const PaymentAccountPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("bank");
  const [bankData, setBankData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: '',
  });
  
  const [paypalData, setPaypalData] = useState({
    paypalEmail: '',
  });
  
  const [stripeData, setStripeData] = useState({
    stripeAccountId: '',
  });
  
  useEffect(() => {
    const loadAccountData = async () => {
      if (user) {
        // Load existing account data if available
        const existingAccount = await getSellerAccount();
        
        if (existingAccount) {
          if (existingAccount.account_type === 'bank') {
            setBankData({
              accountName: existingAccount.account_name,
              accountNumber: existingAccount.account_number,
              bankName: existingAccount.bank_name,
              routingNumber: '',
            });
            setActiveTab('bank');
          } else if (existingAccount.account_type === 'paypal' && existingAccount.paypal_email) {
            setPaypalData({
              paypalEmail: existingAccount.paypal_email,
            });
            setActiveTab('paypal');
          } else if (existingAccount.account_type === 'stripe' && existingAccount.stripe_account_id) {
            setStripeData({
              stripeAccountId: existingAccount.stripe_account_id,
            });
            setActiveTab('stripe');
          }
        }
      }
    };
    
    loadAccountData();
  }, [user]);
  
  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBankData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaypalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaypalData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStripeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStripeData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save payment information",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (activeTab === "bank") {
        // Validate form fields
        if (!bankData.accountName || !bankData.accountNumber || !bankData.bankName) {
          toast({
            title: "Error",
            description: "Please fill all required fields",
            variant: "destructive",
          });
          return;
        }
        
        // Save bank account details
        await createSellerAccount({
          seller_id: user.id,
          account_name: bankData.accountName,
          account_number: bankData.accountNumber,
          bank_name: bankData.bankName,
          account_type: 'bank'
        });
      } else if (activeTab === "paypal") {
        // Validate PayPal email
        if (!paypalData.paypalEmail) {
          toast({
            title: "Error",
            description: "Please enter your PayPal email",
            variant: "destructive",
          });
          return;
        }
        
        // Save PayPal account details
        await createSellerAccount({
          seller_id: user.id,
          account_name: user.name || 'PayPal Account',
          account_number: 'paypal-account',
          bank_name: 'PayPal',
          account_type: 'paypal',
          paypal_email: paypalData.paypalEmail
        });
      } else if (activeTab === "stripe") {
        // Validate Stripe account ID
        if (!stripeData.stripeAccountId) {
          toast({
            title: "Error",
            description: "Please enter your Stripe account ID",
            variant: "destructive",
          });
          return;
        }
        
        // Save Stripe account details
        await createSellerAccount({
          seller_id: user.id,
          account_name: user.name || 'Stripe Account',
          account_number: 'stripe-account',
          bank_name: 'Stripe',
          account_type: 'stripe',
          stripe_account_id: stripeData.stripeAccountId
        });
      }
      
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
      
      <Tabs defaultValue="bank" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="bank">Bank Account</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="applepay">Apple Pay</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="bank" className="bg-white rounded-lg shadow-sm p-6">
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
                    value={bankData.bankName}
                    onChange={handleBankChange}
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
                    value={bankData.accountName}
                    onChange={handleBankChange}
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
                    value={bankData.accountNumber}
                    onChange={handleBankChange}
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
                  value={bankData.routingNumber}
                  onChange={handleBankChange}
                  className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paypal" className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="paypalEmail" className="block text-sm font-medium text-haluna-text mb-1">
                  PayPal Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-haluna-text-light" />
                  </div>
                  <input
                    type="email"
                    id="paypalEmail"
                    name="paypalEmail"
                    placeholder="Enter your PayPal email"
                    value={paypalData.paypalEmail}
                    onChange={handlePaypalChange}
                    className="w-full border rounded-lg p-2.5 pl-10 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700 text-sm">
                  Make sure you use the email associated with your PayPal account. This is where your payments will be sent.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stripe" className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="stripeAccountId" className="block text-sm font-medium text-haluna-text mb-1">
                  Stripe Account ID *
                </label>
                <input
                  type="text"
                  id="stripeAccountId"
                  name="stripeAccountId"
                  placeholder="Enter your Stripe account ID"
                  value={stripeData.stripeAccountId}
                  onChange={handleStripeChange}
                  className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                  required
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700 text-sm">
                  You can find your Stripe account ID in your Stripe Dashboard under Account Settings.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="applepay" className="bg-white rounded-lg shadow-sm p-6">
            <div className="p-4 text-center">
              <p className="text-haluna-text-light mb-4">
                Apple Pay integration is coming soon. Please check back later.
              </p>
            </div>
          </TabsContent>
          
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
      </Tabs>
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg text-sm">
        <p className="text-blue-700 mb-2 font-medium">Important Information:</p>
        <ul className="list-disc list-inside text-blue-600 space-y-1">
          <li>Your payment account information is securely stored</li>
          <li>Payments are processed within 2-3 business days after a sale</li>
          <li>Standard processing fees may apply (typically 2.9% + $0.30)</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentAccountPage;
