
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface OrderDetails {
  orderId: string;
  orderDate: string;
  total: number;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state as OrderDetails;
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If no order details, redirect to shop
    if (!orderDetails) {
      navigate('/shop');
    }
  }, [orderDetails, navigate]);
  
  if (!orderDetails) {
    return null;
  }
  
  const formattedDate = new Date(orderDetails.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Thank You For Your Order!
            </h1>
            
            <p className="text-haluna-text-light mb-8 max-w-xl mx-auto">
              Your order has been placed successfully. We've sent a confirmation email with your order details.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-8 inline-block mx-auto">
              <div className="space-y-2 text-left">
                <div className="flex justify-between gap-8">
                  <span className="text-haluna-text-light font-medium">Order Number:</span>
                  <span className="font-semibold">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-haluna-text-light font-medium">Date:</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-haluna-text-light font-medium">Total:</span>
                  <span className="font-semibold">${orderDetails.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-haluna-text-light font-medium">Payment Method:</span>
                  <span>Credit Card</span>
                </div>
              </div>
            </div>
            
            <p className="mb-8 text-haluna-text-light">
              We'll notify you when your order has been shipped.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/shop')}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/orders')}
              >
                View Order History
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
