
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CartDropdown = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition flex items-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.totalItems > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-haluna-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
          >
            {cart.totalItems}
          </motion.span>
        )}
      </button>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 overflow-hidden"
        >
          <div className="p-4 border-b">
            <h3 className="font-medium">Your Shopping Cart</h3>
            <p className="text-xs text-haluna-text-light">
              {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>
          
          {cart.items.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingCart className="h-10 w-10 text-haluna-text-light mx-auto mb-2" />
              <p className="text-haluna-text-light">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto p-4 space-y-4">
                {cart.items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <p className="text-haluna-primary text-sm font-medium">
                        ${item.product.price.toFixed(2)}
                      </p>
                      
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="text-haluna-text-light">Subtotal</span>
                  <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    to="/cart"
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-center hover:bg-gray-50 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    className="flex-1 py-2 px-4 bg-haluna-primary text-white rounded-md text-center hover:bg-haluna-primary-dark transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CartDropdown;
