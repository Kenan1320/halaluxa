
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Lock, Mail, MapPin, Truck, Store, User, Phone, Building, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

  // New fields for billing address
  company?: string;
  apartment?: string;
  phone?: string;
  saveInformation: boolean;
  
  // Delivery options
  deliveryMethod: 'ship' | 'pickup';
  storeLocation?: string;
}

const initialFormData: CheckoutFormData = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
  paypalEmail: '',
  company: '',
  apartment: '',
  phone: '',
  saveInformation: true,
  deliveryMethod: 'ship',
  storeLocation: ''
};

const Checkout = () => {
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay' | 'googlepay' | 'shoppay'>('card');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDeliveryMethodChange = (value: 'ship' | 'pickup') => {
    setFormData(prev => ({ ...prev, deliveryMethod: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || 
        (formData.deliveryMethod === 'ship' && (!formData.address || !formData.city || !formData.state || !formData.zipCode))) {
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
        address: formData.deliveryMethod === 'ship' ? formData.address : '',
        city: formData.deliveryMethod === 'ship' ? formData.city : '',
        state: formData.deliveryMethod === 'ship' ? formData.state : '',
        zipCode: formData.deliveryMethod === 'ship' ? formData.zipCode : '',
        country: formData.country,
        deliveryMethod: formData.deliveryMethod,
        storeLocation: formData.storeLocation,
        phone: formData.phone,
        saveInformation: formData.saveInformation
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
      } else if (paymentMethod === 'googlepay') {
        paymentMethodDetails = {
          type: 'googlepay'
        };
      } else if (paymentMethod === 'shoppay') {
        paymentMethodDetails = {
          type: 'shoppay'
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Checkout Steps */}
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Contact</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email or mobile phone number
                      </Label>
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
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="emailUpdates" 
                        checked={true}
                        onCheckedChange={(checked) => {}}
                      />
                      <Label htmlFor="emailUpdates" className="text-sm">
                        Email me with news and offers
                      </Label>
                    </div>
                  </div>
                </div>
                
                {/* Delivery Method */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Delivery</h2>
                  
                  <RadioGroup 
                    value={formData.deliveryMethod} 
                    onValueChange={(value) => handleDeliveryMethodChange(value as 'ship' | 'pickup')}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ship" id="ship" />
                        <Label htmlFor="ship" className="font-medium">Ship</Label>
                      </div>
                      <Truck className="h-5 w-5 text-haluna-text-light" />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup" id="pickup" />
                        <Label htmlFor="pickup" className="font-medium">Pickup in store</Label>
                      </div>
                      <Store className="h-5 w-5 text-haluna-text-light" />
                    </div>
                  </RadioGroup>
                  
                  {formData.deliveryMethod === 'pickup' && (
                    <div className="mt-6 space-y-4">
                      <h3 className="font-medium">Store locations</h3>
                      <p className="text-sm text-haluna-text-light">There is 1 store with stock close to your location</p>
                      <button type="button" className="text-blue-600 text-sm">Change location</button>
                      
                      <div className="border rounded-lg p-4">
                        <RadioGroup defaultValue="store1">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="store1" id="store1" className="mt-1" />
                              <div>
                                <Label htmlFor="store1" className="font-medium">1030 Stelton Rd, Piscataway, NJ 08854 (28 mi)</Label>
                                <p className="text-sm text-haluna-text-light mt-1">1030 Stelton Road, 103, Piscataway NJ</p>
                                <p className="text-sm text-haluna-text-light mt-1">Usually ready in 24 hours</p>
                              </div>
                            </div>
                            <span className="font-medium">FREE</span>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox id="textUpdates" />
                        <Label htmlFor="textUpdates" className="text-sm">
                          Text me with news and offers
                        </Label>
                      </div>
                    </div>
                  )}
                  
                  {formData.deliveryMethod === 'ship' && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="fullName" className="block text-sm font-medium mb-1">
                          Full name
                        </Label>
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
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="address" className="block text-sm font-medium mb-1">
                          Address
                        </Label>
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
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="apartment" className="block text-sm font-medium mb-1">
                          Apartment, suite, etc. (optional)
                        </Label>
                        <input
                          type="text"
                          id="apartment"
                          name="apartment"
                          value={formData.apartment || ''}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="city" className="block text-sm font-medium mb-1">
                          City
                        </Label>
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
                        <Label htmlFor="country" className="block text-sm font-medium mb-1">
                          Country/Region
                        </Label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                          required
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="AE">United Arab Emirates</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="state" className="block text-sm font-medium mb-1">
                          State
                        </Label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                          required
                        >
                          <option value="">Select a state</option>
                          <option value="NY">New York</option>
                          <option value="CA">California</option>
                          <option value="TX">Texas</option>
                          <option value="FL">Florida</option>
                          <option value="IL">Illinois</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                          ZIP code
                        </Label>
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
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone (optional)
                        </Label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">Payment</h2>
                    <p className="text-sm text-haluna-text-light flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      All transactions are secure and encrypted
                    </p>
                  </div>
                  
                  {/* Express checkout options */}
                  <div className="mb-6">
                    <h3 className="text-lg mb-4 text-center">Express checkout</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('shoppay')}
                        className={`h-14 rounded-lg border flex items-center justify-center ${paymentMethod === 'shoppay' ? 'border-blue-500 shadow-sm' : 'border-gray-300'}`}
                      >
                        <img src="/lovable-uploads/23c8a527-4c88-45b8-96c7-2e04ebee04eb.png" alt="Shop Pay" className="h-8" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`h-14 rounded-lg border flex items-center justify-center ${paymentMethod === 'paypal' ? 'border-blue-500 shadow-sm' : 'border-gray-300'}`}
                      >
                        <img src="/lovable-uploads/b7391005-ab3c-4698-85d5-1192b4fc4df6.png" alt="PayPal" className="h-6" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('applepay')}
                        className={`h-14 rounded-lg border flex items-center justify-center ${paymentMethod === 'applepay' ? 'border-blue-500 shadow-sm' : 'border-gray-300'}`}
                      >
                        <img src="/lovable-uploads/3c7163e3-7825-410e-b6d1-2e91e6ec2442.png" alt="Apple Pay" className="h-6" />
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="w-full text-blue-600 py-2 text-sm font-medium flex items-center justify-center"
                    >
                      {showMoreOptions ? 'Hide options' : 'Show more options'}
                      <svg className={`ml-1 h-4 w-4 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {showMoreOptions && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('googlepay')}
                          className={`h-14 rounded-lg border flex items-center justify-center ${paymentMethod === 'googlepay' ? 'border-blue-500 shadow-sm' : 'border-gray-300'}`}
                        >
                          <img src="/lovable-uploads/30853bea-af12-4b7d-9bf5-14f37b607a62.png" alt="Google Pay" className="h-8" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  
                  {/* Credit card form */}
                  <div className="mt-4">
                    <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)} className="space-y-4">
                      <div className={`border rounded-lg p-4 ${paymentMethod === 'card' ? 'border-blue-500 shadow-sm' : ''}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="font-medium">Credit card</Label>
                          </div>
                          <div className="flex space-x-2">
                            <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/0169695890db3db16bfe.svg" alt="Visa" className="h-6" />
                            <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/ae9ceec48b1dc489596c.svg" alt="Mastercard" className="h-6" />
                            <img src="https://cdn.shopify.com/shopifycloud/checkout-web/assets/5b6ca02f895540b546e9.svg" alt="Amex" className="h-6" />
                            <span className="text-sm text-blue-600">+5</span>
                          </div>
                        </div>
                        
                        {paymentMethod === 'card' && (
                          <div className="space-y-4 pt-2">
                            <div>
                              <Label htmlFor="cardNumber" className="sr-only">
                                Card number
                              </Label>
                              <div className="relative">
                                <input
                                  type="text"
                                  id="cardNumber"
                                  name="cardNumber"
                                  placeholder="Card number"
                                  value={formData.cardNumber}
                                  onChange={handleChange}
                                  className="w-full border rounded-lg p-2.5 pr-10 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                                  required
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="expiryDate" className="sr-only">
                                Expiration date (MM / YY)
                              </Label>
                              <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                placeholder="Expiration date (MM / YY)"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                                required
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="cvv" className="sr-only">
                                Security code
                              </Label>
                              <div className="relative">
                                <input
                                  type="text"
                                  id="cvv"
                                  name="cvv"
                                  placeholder="Security code"
                                  value={formData.cvv}
                                  onChange={handleChange}
                                  className="w-full border rounded-lg p-2.5 pr-10 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                                  required
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <button type="button" className="text-gray-400 h-5 w-5 rounded-full border border-gray-400 flex items-center justify-center text-xs font-bold">?</button>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="cardName" className="sr-only">
                                Name on card
                              </Label>
                              <input
                                type="text"
                                id="cardName"
                                name="cardName"
                                placeholder="Name on card"
                                value={formData.cardName}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={`border rounded-lg p-4 ${paymentMethod === 'paypal' ? 'border-blue-500 shadow-sm' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal-radio" />
                            <Label htmlFor="paypal-radio" className="font-medium">PayPal</Label>
                          </div>
                          <img src="/lovable-uploads/b7391005-ab3c-4698-85d5-1192b4fc4df6.png" alt="PayPal" className="h-6" />
                        </div>
                      </div>
                      
                      <div className={`border rounded-lg p-4 ${paymentMethod === 'shoppay' ? 'border-blue-500 shadow-sm' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="shoppay" id="shoppay-radio" />
                            <Label htmlFor="shoppay-radio" className="font-medium">
                              Shop Pay <span className="text-sm font-normal text-gray-500">| Pay in full or in installments</span>
                            </Label>
                          </div>
                          <img src="/lovable-uploads/23c8a527-4c88-45b8-96c7-2e04ebee04eb.png" alt="Shop Pay" className="h-6" />
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                {/* Remember me section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-medium mb-6">Remember me</h2>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="saveInformation" 
                      checked={formData.saveInformation}
                      onCheckedChange={(checked) => handleCheckboxChange('saveInformation', checked as boolean)}
                    />
                    <Label htmlFor="saveInformation" className="text-sm">
                      Save my information for a faster checkout with a Shop account
                    </Label>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay now'}
                </Button>
              </form>
            </div>
            
            {/* Right Column - Order Summary */}
            <div className="w-full md:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Order summary</h2>
                  <button className="text-blue-600 flex items-center text-sm font-medium">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Details
                  </button>
                </div>
                
                <div className="max-h-80 overflow-y-auto mb-6">
                  {cart.items.map((item, index) => (
                    <div key={item.product.id} className="flex gap-3 mb-4 pb-4 border-b last:border-0">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">
                          {index + 1}
                        </div>
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
                
                <div className="border-t border-b py-4 mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Discount code or gift card"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-grow border rounded-l-lg p-2.5 focus:ring-1 focus:ring-haluna-primary focus:border-haluna-primary"
                    />
                    <button 
                      type="button"
                      className="bg-gray-200 text-gray-700 font-medium px-4 rounded-r-lg"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-haluna-text-light">Subtotal</span>
                    <span>${cart.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-haluna-text-light">
                      {formData.deliveryMethod === 'ship' ? 'Shipping' : 'Pickup in store'}
                    </span>
                    <span className="font-medium">FREE</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-lg">Total</span>
                      <span className="text-sm text-gray-500 ml-1">USD</span>
                    </div>
                    <span className="font-medium text-xl">${cart.totalPrice.toFixed(2)}</span>
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
