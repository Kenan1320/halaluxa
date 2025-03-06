
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash, Plus, Minus, ArrowLeft, Store, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { getShopById } from '@/services/shopService';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [shopGroups, setShopGroups] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadShopDetails = async () => {
      setIsLoading(true);
      try {
        const groups: Record<string, any> = {};
        
        // First, create groups by seller ID
        const sellerGroups: Record<string, any[]> = {};
        
        cart.items.forEach(item => {
          if (!sellerGroups[item.product.sellerId]) {
            sellerGroups[item.product.sellerId] = [];
          }
          sellerGroups[item.product.sellerId].push(item);
        });
        
        // Then, fetch shop details for each seller
        await Promise.all(
          Object.keys(sellerGroups).map(async (sellerId) => {
            const shop = await getShopById(sellerId);
            groups[sellerId] = {
              shop,
              items: sellerGroups[sellerId],
              subtotal: sellerGroups[sellerId].reduce(
                (sum, item) => sum + (item.product.price * item.quantity), 
                0
              )
            };
          })
        );
        
        setShopGroups(groups);
      } catch (error) {
        console.error("Error loading shop details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (cart.items.length > 0) {
      loadShopDetails();
    } else {
      setIsLoading(false);
    }
  }, [cart.items]);
  
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };
  
  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please login to proceed to checkout",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };
  
  const cartTotal = cart.items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  );
  
  const totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity, 
    0
  );
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">Your Cart</h1>
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-40 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link 
              to="/shop"
              className="inline-flex items-center text-haluna-text-light hover:text-haluna-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Your Cart</h1>
          <p className="text-haluna-text-light mb-8">
            {totalItems === 0 
              ? "Your cart is empty" 
              : `You have ${totalItems} item${totalItems === 1 ? '' : 's'} in your cart`}
          </p>
          
          {cart.items.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-10 w-10 text-haluna-text-light" />
              </div>
              <h2 className="text-2xl font-serif font-medium mb-4">Your cart is empty</h2>
              <p className="text-haluna-text-light mb-8 max-w-md mx-auto">
                Looks like you haven't added any products to your cart yet. Browse our collections and discover amazing products.
              </p>
              <Button href="/shops" size="lg">
                Browse Shops
              </Button>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                {Object.keys(shopGroups).map((sellerId) => {
                  const group = shopGroups[sellerId];
                  return (
                    <motion.div 
                      key={sellerId}
                      className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 border-b bg-gray-50 flex items-center">
                        {group.shop?.logo ? (
                          <img 
                            src={group.shop.logo} 
                            alt={group.shop?.name} 
                            className="w-10 h-10 object-cover rounded-lg mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-haluna-primary-light rounded-lg flex items-center justify-center mr-3">
                            <Store className="h-5 w-5 text-haluna-primary" />
                          </div>
                        )}
                        <div>
                          <Link 
                            to={`/shop/${sellerId}`}
                            className="font-medium hover:text-haluna-primary transition-colors"
                          >
                            {group.shop?.name || "Shop"}
                          </Link>
                          <div className="text-xs text-haluna-text-light">
                            {group.items.length} item{group.items.length === 1 ? '' : 's'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="divide-y">
                        {group.items.map((item: any) => (
                          <div key={item.product.id} className="p-4 md:p-6 flex flex-col md:flex-row items-start">
                            <div className="w-full md:w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4">
                              <img 
                                src={item.product.images?.[0] || '/placeholder.svg'} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="font-medium hover:text-haluna-primary transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              <div className="text-sm text-haluna-text-light mb-2">
                                {item.product.category}
                              </div>
                              
                              <div className="flex flex-wrap justify-between items-end">
                                <div className="flex items-center mb-2 md:mb-0">
                                  <button 
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="mx-3 min-w-10 text-center">{item.quantity}</span>
                                  <button 
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                  <button 
                                    className="text-haluna-text-light hover:text-red-500 transition-colors"
                                    onClick={() => handleRemoveItem(item.product.id)}
                                  >
                                    <Trash className="h-5 w-5" />
                                  </button>
                                  <span className="font-medium text-lg">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 bg-gray-50 text-right">
                        <span className="text-sm font-medium">
                          Subtotal: ${group.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="lg:col-span-1">
                <motion.div 
                  className="bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-28"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="text-xl font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-haluna-text-light">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-haluna-text-light">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-haluna-text-light">Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      onClick={handleCheckout}
                      className="w-full"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/shops')}
                      className="w-full flex items-center justify-center"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
