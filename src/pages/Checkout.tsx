
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Lock, Mail, CreditCardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { processPayment } from '@/services/paymentService';

interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Credit card details
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  
  // PayPal details
  paypalEmail: string;
}

const initialFormData: CheckoutFormData = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
  paypalEmail: ''
};

const Checkout = () => {
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay' | 'stripe'>('card');
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email
      }));
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Additional validation based on payment method
    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv)) {
      toast({
        title: "Error",
        description: "Please fill all card details",
        variant: "destructive",
      });
      return;
    }
    
    if (paymentMethod === 'paypal' && !formData.paypalEmail) {
      toast({
        title: "Error",
        description: "Please enter your PayPal email",
        variant: "destructive",
      });
      return;
    }
    
    // Process payment
    setIsProcessing(true);
    
    try {
      // Prepare shipping details
      const shippingDetails = {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      };
      
      // Prepare payment method based on selected type
      let paymentMethodDetails;
      
      if (paymentMethod === 'card') {
        paymentMethodDetails = {
          type: 'card',
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        };
      } else if (paymentMethod === 'paypal') {
        paymentMethodDetails = {
          type: 'paypal',
          paypalEmail: formData.paypalEmail
        };
      } else if (paymentMethod === 'applepay') {
        paymentMethodDetails = {
          type: 'applepay'
        };
      } else if (paymentMethod === 'stripe') {
        paymentMethodDetails = {
          type: 'stripe',
          stripeToken: 'demo-token-' + Date.now()
        };
      }
      
      // Process payment
      const result = await processPayment(cart, paymentMethodDetails, shippingDetails);
      
      // Clear cart and redirect to confirmation
      clearCart();
      
      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${result.orderId} has been placed.`,
      });
      
      // Redirect to confirmation page
      navigate('/order-confirmation', { 
        state: { 
          orderId: result.orderId,
          orderDate: result.orderDate,
          total: cart.totalPrice
        } 
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-haluna-text mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-haluna-text mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-haluna-text mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-haluna-text mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-haluna-text mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-haluna-text mb-1">
                        Zip/Postal Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-haluna-text mb-1">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        required
                      >
                        <option value="">Select a country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="AE">United Arab Emirates</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Payment Method</h2>
                  
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-haluna-text-light flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      Secure Payment Processing
                    </p>
                    
                    <div className="flex gap-2">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as any)}>
                    <TabsList className="mb-6 w-full">
                      <TabsTrigger value="card" className="flex-1">Credit/Debit Card</TabsTrigger>
                      <TabsTrigger value="paypal" className="flex-1">PayPal</TabsTrigger>
                      <TabsTrigger value="applepay" className="flex-1">Apple Pay</TabsTrigger>
                      <TabsTrigger value="stripe" className="flex-1">Stripe</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="card">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-haluna-text mb-1">
                            Card Number *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <CreditCard className="h-5 w-5 text-haluna-text-light" />
                            </div>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="1234 5678 9012 3456"
                              className="w-full border rounded-lg p-2.5 pl-10 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                              required={paymentMethod === 'card'}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-haluna-text mb-1">
                            Name on Card *
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                            required={paymentMethod === 'card'}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-haluna-text mb-1">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                              required={paymentMethod === 'card'}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-haluna-text mb-1">
                              CVV *
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              placeholder="123"
                              className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                              required={paymentMethod === 'card'}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="paypal">
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
                              value={formData.paypalEmail}
                              onChange={handleChange}
                              className="w-full border rounded-lg p-2.5 pl-10 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                              required={paymentMethod === 'paypal'}
                            />
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-700 text-sm">
                            After clicking "Complete Purchase", you will be redirected to PayPal to complete your payment.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="applepay">
                      <div className="p-4 text-center">
                        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 14C7.58 14 4 12.21 4 10V14C4 16.21 7.58 18 12 18C16.42 18 20 16.21 20 14V10C20 12.21 16.42 14 12 14Z"></path>
                            <path d="M12 10C7.58 10 4 8.21 4 6V10C4 12.21 7.58 14 12 14C16.42 14 20 12.21 20 10V6C20 8.21 16.42 10 12 10Z"></path>
                            <ellipse cx="12" cy="6" rx="8" ry="3"></ellipse>
                          </svg>
                        </div>
                        
                        <p className="text-haluna-text-light mb-4">
                          After clicking "Complete Purchase", you'll be prompted to confirm with Apple Pay.
                        </p>
                        
                        <div className="w-full h-12 bg-black rounded-md flex items-center justify-center text-white">
                          Apple Pay
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="stripe">
                      <div className="p-4 text-center">
                        <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12Z"></path>
                            <path d="M16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12Z"></path>
                          </svg>
                        </div>
                        
                        <p className="text-haluna-text-light mb-4">
                          After clicking "Complete Purchase", you'll be redirected to Stripe's secure payment page.
                        </p>
                        
                        <div className="w-full h-12 bg-purple-600 rounded-md flex items-center justify-center text-white">
                          Pay with Stripe
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Complete Purchase • $${cart.totalPrice.toFixed(2)}`}
                </Button>
              </form>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                
                <div className="max-h-80 overflow-y-auto mb-6">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 mb-4 pb-4 border-b last:border-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-haluna-text-light">Qty: {item.quantity}</p>
                        <p className="text-haluna-primary text-sm font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-haluna-text-light">Subtotal</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-haluna-text-light">Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                
                <div className="border-t py-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
