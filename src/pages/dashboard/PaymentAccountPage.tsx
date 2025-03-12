
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getSellerAccount, 
  saveSellerAccount,
  formatPaymentMethod
} from '@/services/paymentService';
import { SellerAccount } from '@/types/database';

const PaymentAccountPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState<SellerAccount | null>(null);
  const [accountType, setAccountType] = useState('bank');
  
  // Form fields
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [stripeAccountId, setStripeAccountId] = useState('');
  const [applePayMerchantId, setApplePayMerchantId] = useState('');
  
  useEffect(() => {
    const loadAccountDetails = async () => {
      try {
        const account = await getSellerAccount();
        if (account) {
          setAccountDetails(account);
          setAccountType(account.account_type);
          // Check if these properties exist before setting state
          setAccountName(account.account_name || '');
          setAccountNumber(account.account_number || '');
          setBankName(account.bank_name || '');
          setPaypalEmail(account.paypal_email || '');
          setStripeAccountId(account.stripe_account_id || '');
          setApplePayMerchantId(account.applepay_merchant_id || '');
        }
      } catch (error) {
        console.error('Error loading account details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment account details',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAccountDetails();
  }, [toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create an object with only the properties that exist in SellerAccount type
      const updatedAccount = await saveSellerAccount({
        ...accountDetails,
        account_type: accountType,
        account_number: accountNumber,
        bank_name: bankName,
        // Use added fields from our updated SellerAccount type
        paypal_email: paypalEmail,
        stripe_account_id: stripeAccountId,
        applepay_merchant_id: applePayMerchantId,
        account_name: accountName
      });
      
      if (updatedAccount) {
        setAccountDetails(updatedAccount);
        toast({
          title: 'Success',
          description: 'Payment account details updated successfully'
        });
      }
    } catch (error) {
      console.error('Error saving account details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment account details',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Payment Account</h1>
      <p className="text-gray-500">
        Manage your payment account details. This is where you'll receive payouts for your sales.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            {accountDetails ? 
              `Current payment method: ${formatPaymentMethod(accountDetails)}` : 
              'Set up your payment method to receive payments'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accountType">Payment Method</Label>
              <Select 
                value={accountType} 
                onValueChange={setAccountType}
              >
                <SelectTrigger id="accountType">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="applepay">Apple Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {accountType === 'bank' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input 
                    id="accountName"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input 
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Bank of America"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input 
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
                    type="password"
                  />
                </div>
              </>
            )}
            
            {accountType === 'paypal' && (
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">PayPal Email</Label>
                <Input 
                  id="paypalEmail"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="e.g. johndoe@example.com"
                  type="email"
                />
              </div>
            )}
            
            {accountType === 'stripe' && (
              <div className="space-y-2">
                <Label htmlFor="stripeAccountId">Stripe Account ID</Label>
                <Input 
                  id="stripeAccountId"
                  value={stripeAccountId}
                  onChange={(e) => setStripeAccountId(e.target.value)}
                  placeholder="e.g. acct_1234567890"
                />
              </div>
            )}
            
            {accountType === 'applepay' && (
              <div className="space-y-2">
                <Label htmlFor="applePayMerchantId">Apple Pay Merchant ID</Label>
                <Input 
                  id="applePayMerchantId"
                  value={applePayMerchantId}
                  onChange={(e) => setApplePayMerchantId(e.target.value)}
                  placeholder="e.g. merchant.com.example.shop"
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Account Details'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentAccountPage;
