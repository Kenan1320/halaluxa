import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, DollarSign, Trash2, AlertCircle, ChevronsUpDown, Plus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { 
  getSellerAccount,
  getSellerAccounts,
  createSellerAccount,
  updateSellerAccount,
  formatPaymentMethod,
  PaymentMethod
} from '@/services/paymentService';

const PaymentAccountPage = () => {
  const [accounts, setAccounts] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bank');
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    type: 'bank',
    paypalEmail: '',
    stripeAccountId: '',
    applePayMerchantId: '',
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const shopId = localStorage.getItem('currentShopId') || '';
      const accountsData = await getSellerAccounts(shopId);
      setAccounts(accountsData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Error",
        description: "Could not load payment accounts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      accountName: '',
      accountNumber: '',
      bankName: '',
      type: activeTab,
      paypalEmail: '',
      stripeAccountId: '',
      applePayMerchantId: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const shopId = localStorage.getItem('currentShopId') || '';
      
      // Set method_type based on active tab
      const accountData: Partial<PaymentMethod> = {
        shopId,
        type: activeTab as PaymentMethod['type'],
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        paypalEmail: formData.paypalEmail,
        stripeAccountId: formData.stripeAccountId,
        isActive: true,
        isDefault: accounts.length === 0 // Make the first account default
      };
      
      const result = await createSellerAccount(accountData);
      
      if (result) {
        toast({
          title: "Success",
          description: "Payment method added successfully",
        });
        
        fetchAccounts();
        resetForm();
        setIsFormVisible(false);
      }
    } catch (error) {
      console.error("Error saving account:", error);
      toast({
        title: "Error",
        description: "Could not save payment information",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <CreditCard className="h-5 w-5" />;
      case 'paypal':
        return (
          <div className="bg-[#0070BA] text-white p-1 rounded-full">
            <span className="font-bold text-xs">P</span>
          </div>
        );
      case 'stripe':
        return (
          <div className="bg-purple-600 text-white p-1 rounded-full">
            <span className="font-bold text-xs">S</span>
          </div>
        );
      case 'applepay':
        return (
          <div className="bg-black text-white p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 17a6 6 0 0 0 5.8-4M15 9a6 6 0 0 0-5.8 4" />
              <path d="M17 9.3c-.5-.1-1.6-.2-2 .3-.5.7 1-.5 1-1 0-1-.2-1.3-.4-1.7a2 2 0 0 0-2.9-.3c-.2.2-.3.5-.3.800 0 .7 1.2 1 2 1.4.8.2 2 .5 2 1.5s-1 1.7-2 1.7c-.5 0-2 0-2-2"/>
            </svg>
          </div>
        );
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-haluna-text">Payment Methods</h1>
          <p className="text-haluna-text-light">
            Manage how you receive payments from customers
          </p>
        </div>
        <Button
          onClick={() => {
            setIsFormVisible(!isFormVisible);
            if (!isFormVisible) resetForm();
          }}
          className="flex items-center bg-orange-400 hover:bg-orange-500"
        >
          {isFormVisible ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </>
          )}
        </Button>
      </div>

      {isFormVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Add New Payment Method</h2>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="bank" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Bank</span>
                </TabsTrigger>
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <div className="bg-[#0070BA] text-white p-0.5 rounded-full">
                    <span className="font-bold text-xs">P</span>
                  </div>
                  <span>PayPal</span>
                </TabsTrigger>
                <TabsTrigger value="stripe" className="flex items-center gap-2">
                  <div className="bg-purple-600 text-white p-0.5 rounded-full">
                    <span className="font-bold text-xs">S</span>
                  </div>
                  <span>Stripe</span>
                </TabsTrigger>
                <TabsTrigger value="applepay" className="flex items-center gap-2">
                  <div className="bg-black text-white p-0.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 17a6 6 0 0 0 5.8-4M15 9a6 6 0 0 0-5.8 4" />
                      <path d="M17 9.3c-.5-.1-1.6-.2-2 .3-.5.7 1-.5 1-1 0-1-.2-1.3-.4-1.7a2 2 0 0 0-2.9-.3c-.2.2-.3.5-.3.800 0 .7 1.2 1 2 1.4.8.2 2 .5 2 1.5s-1 1.7-2 1.7c-.5 0-2 0-2-2"/>
                    </svg>
                  </div>
                  <span>Apple Pay</span>
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit}>
                <TabsContent value="bank" className="space-y-4">
                  <div>
                    <label htmlFor="accountName" className="block text-sm font-medium mb-1">
                      Account Holder Name
                    </label>
                    <input
                      id="accountName"
                      name="accountName"
                      type="text"
                      required
                      className="w-full rounded-md border p-2"
                      value={formData.accountName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium mb-1">
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      required
                      className="w-full rounded-md border p-2"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bankName" className="block text-sm font-medium mb-1">
                      Bank Name
                    </label>
                    <input
                      id="bankName"
                      name="bankName"
                      type="text"
                      required
                      className="w-full rounded-md border p-2"
                      value={formData.bankName}
                      onChange={handleInputChange}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="paypal" className="space-y-4">
                  <div>
                    <label htmlFor="paypalEmail" className="block text-sm font-medium mb-1">
                      PayPal Email
                    </label>
                    <input
                      id="paypalEmail"
                      name="paypalEmail"
                      type="email"
                      required
                      className="w-full rounded-md border p-2"
                      value={formData.paypalEmail}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md text-sm">
                    <p>
                      Payments will be sent to this PayPal account. Make sure the email is correct
                      and associated with an active PayPal account.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="stripe" className="space-y-4">
                  <div>
                    <label htmlFor="stripeAccountId" className="block text-sm font-medium mb-1">
                      Stripe Account ID
                    </label>
                    <input
                      id="stripeAccountId"
                      name="stripeAccountId"
                      type="text"
                      required
                      className="w-full rounded-md border p-2"
                      value={formData.stripeAccountId}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-md text-sm">
                    <p>
                      Enter your Stripe account ID to receive payments directly to your Stripe account.
                      You can find this in your Stripe dashboard.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="applepay" className="space-y-4">
                  <div>
                    <label htmlFor="applePayMerchantId" className="block text-sm font-medium mb-1">
                      Apple Pay Merchant ID
                    </label>
                    <input
                      id="applePayMerchantId"
                      name="applePayMerchantId"
                      type="text"
                      required
                      className="w-full rounded-md border p-2"
                      value={formData.applePayMerchantId}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md text-sm">
                    <p>
                      Your Apple Pay Merchant ID is required to process Apple Pay payments.
                      You can find this in your Apple Developer account.
                    </p>
                  </div>
                </TabsContent>
                
                <div className="mt-6 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormVisible(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-orange-400 hover:bg-orange-500">
                    Save Payment Method
                  </Button>
                </div>
              </form>
            </Tabs>
          </Card>
        </motion.div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center p-4 border rounded-lg">
                <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : accounts.length > 0 ? (
          <div className="divide-y">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                    {getAccountTypeIcon(account.type)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {account.type === 'bank' 
                        ? `${account.bankName} - ${account.accountNumber?.slice(-4)}` 
                        : account.type === 'paypal'
                        ? `PayPal - ${account.paypalEmail}`
                        : account.type === 'stripe'
                        ? `Stripe - ${account.stripeAccountId}`
                        : 'Apple Pay'}
                    </p>
                    <p className="text-sm text-haluna-text-light">
                      Added on {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={async () => {
                      try {
                        // Soft-delete by setting isActive to false
                        const result = await updateSellerAccount({
                          id: account.id,
                          isActive: false
                        });
                        
                        if (result) {
                          toast({
                            title: "Success",
                            description: "Payment method removed"
                          });
                          fetchAccounts();
                        }
                      } catch (error) {
                        console.error("Error removing payment method:", error);
                        toast({
                          title: "Error",
                          description: "Could not remove payment method",
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-haluna-text-light" />
            </div>
            <h3 className="text-xl font-medium mb-2">No payment methods yet</h3>
            <p className="text-haluna-text-light mb-6 max-w-md mx-auto">
              Add a payment method to start receiving payments from your customers
            </p>
            <Button
              onClick={() => setIsFormVisible(true)}
              className="flex items-center mx-auto bg-orange-400 hover:bg-orange-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertCircle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="font-medium mb-2">Important Information About Payouts</h3>
            <p className="text-sm mb-4">
              Payouts are processed within 3-5 business days after a successful order. 
              The platform charges a 2% transaction fee on each order, which is deducted automatically.
            </p>
            <p className="text-sm">
              Make sure your payment information is accurate to avoid delays in receiving your funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAccountPage;
