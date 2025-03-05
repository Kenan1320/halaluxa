
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6">Your Cart</h1>
          
          {cart.items.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-haluna-text-light mx-auto mb-4" />
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-haluna-text-light mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. 
                Check out our shop to find halal products from Muslim-owned businesses.
              </p>
              <Button onClick={() => navigate('/shop')}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-medium">Cart Items ({cart.totalItems})</h2>
                      <button 
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear Cart
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    {cart.items.map((item) => (
                      <div key={item.product.id} className="p-6 border-b flex flex-col md:flex-row gap-4">
                        <div className="md:w-24 md:h-24 w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                            <div>
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="font-medium hover:text-haluna-primary transition-colors"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-haluna-text-light mb-2">
                                Category: {item.product.category}
                              </p>
                            </div>
                            
                            <div className="text-haluna-primary font-medium">
                              ${item.product.price.toFixed(2)}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-end mt-2">
                            <div className="flex items-center border rounded-md">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="px-3 py-1 border-r hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="px-3 py-1 border-l hover:bg-gray-100"
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <h2 className="text-xl font-medium mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-haluna-text-light">Subtotal</span>
                      <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-haluna-text-light">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-b py-4 mb-6">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${cart.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/checkout')} 
                    className="w-full"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <button
                    onClick={() => navigate('/shop')}
                    className="w-full text-center mt-4 text-haluna-primary hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
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
