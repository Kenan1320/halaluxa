
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const CartDropdown = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Calculate subtotal from cart
  const getSubtotal = () => {
    return cart.totalPrice;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-white hover:text-white/80 transition relative"
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {cart.items.length}
          </span>
        )}
        <span className="ml-2 hidden md:inline">Cart</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium">Shopping Cart ({cart.items.length})</h3>
              <button onClick={toggleDropdown} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {cart.items.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingCart className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Button href="/shop" variant="outline" onClick={toggleDropdown} size="sm">
                  Start Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="max-h-72 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="p-3 border-b flex items-center">
                      <div 
                        className="w-14 h-14 bg-cover bg-center rounded mr-3 flex-shrink-0" 
                        style={{ backgroundImage: `url(${item.product.images?.[0] || '/placeholder.svg'})` }}
                      />
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} x {item.quantity}</p>
                        <div className="flex items-center mt-1">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="mx-2 text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-end flex-col">
                        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-bold">${getSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      href="/checkout" 
                      onClick={toggleDropdown}
                      className="w-full flex items-center justify-center"
                    >
                      Checkout <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    
                    <Link 
                      to="/cart" 
                      onClick={toggleDropdown}
                      className="text-center text-sm text-haluna-primary hover:text-haluna-primary-dark"
                    >
                      View Cart
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartDropdown;
