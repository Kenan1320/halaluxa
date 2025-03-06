
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Group cart items by sellerId for a better display
  const groupedItems = cart.items.reduce((groups, item) => {
    const sellerId = item.product.sellerId || 'unknown';
    if (!groups[sellerId]) {
      groups[sellerId] = {
        sellerName: item.product.sellerName || 'Unknown Seller',
        items: []
      };
    }
    groups[sellerId].items.push(item);
    return groups;
  }, {});
  
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };
  
  const handleQuantityChange = (productId, newQuantity, maxStock) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    
    if (maxStock && newQuantity > maxStock) {
      toast({
        title: "Maximum stock reached",
        description: `Only ${maxStock} items available`,
        variant: "destructive"
      });
      updateQuantity(productId, maxStock);
      return;
    }
    
    updateQuantity(productId, newQuantity);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">Your Cart</h1>
          </div>
          
          {cart.items.length === 0 ? (
            <motion.div 
              className="bg-white rounded-xl shadow-sm p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-haluna-text-light mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Check out our shop to find halal products from Muslim-owned businesses.
              </p>
              <Button 
                onClick={() => navigate('/shop')}
                className="px-8"
              >
                Browse Products
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                  <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-medium">Cart Items ({cart.totalItems})</h2>
                    <button 
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 text-sm flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear Cart
                    </button>
                  </div>
                  
                  {/* Display items grouped by seller */}
                  {Object.entries(groupedItems).map(([sellerId, group]) => (
                    <div key={sellerId} className="border-b last:border-b-0">
                      <div className="px-6 pt-4 pb-2">
                        <p className="text-sm font-medium text-haluna-primary">{group.sellerName}</p>
                      </div>
                      
                      {group.items.map((item, index) => (
                        <motion.div 
                          key={item.product.id}
                          className="p-4 px-6 border-t first:border-t-0 flex gap-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Link to={`/product/${item.product.id}`} className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </Link>
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <Link 
                                  to={`/product/${item.product.id}`}
                                  className="font-medium hover:text-haluna-primary transition-colors"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="text-sm text-haluna-text-light">
                                  Category: {item.product.category}
                                </p>
                              </div>
                              <p className="font-medium text-haluna-primary">
                                ${item.product.price.toFixed(2)}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center border rounded-md">
                                <button 
                                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                  className="px-3 py-1 border-r hover:bg-gray-100"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-4 py-1">{item.quantity}</span>
                                <button 
                                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.product.stock)}
                                  className="px-3 py-1 border-l hover:bg-gray-100"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleRemoveItem(item.product.id)}
                                className="text-red-500 hover:text-red-700 p-2"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/shop')}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button 
                    onClick={() => navigate('/checkout')}
                    className="flex-1"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-haluna-text-light">Subtotal ({cart.totalItems} items)</span>
                      <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-haluna-text-light">Shipping</span>
                      <span className="text-sm">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-haluna-text-light">Tax</span>
                      <span className="text-sm">Calculated at checkout</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-b py-4 mb-6">
                    <div className="flex justify-between font-medium">
                      <span>Estimated Total</span>
                      <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/checkout')} 
                    className="w-full flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="mt-6 space-y-2">
                    <p className="text-xs text-center text-haluna-text-light">We accept</p>
                    <div className="flex justify-center gap-2">
                      <div className="w-10 h-6 bg-blue-100 rounded"></div>
                      <div className="w-10 h-6 bg-red-100 rounded"></div>
                      <div className="w-10 h-6 bg-green-100 rounded"></div>
                      <div className="w-10 h-6 bg-yellow-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
