
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, removeFromCart } = useCart();
  
  const toggleCart = () => setIsOpen(!isOpen);
  
  return (
    <div className="relative">
      <button 
        onClick={toggleCart}
        className="flex items-center text-gray-700 hover:text-haluna-primary transition-colors focus:outline-none"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-6 w-6" />
        {cart.items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-haluna-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart.items.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </button>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden"
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">Your Cart</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div>
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex items-center p-4 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                      <img 
                        src={item.product.images?.[0] || '/placeholder.svg'} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-haluna-primary font-medium">${item.product.price}</span>
                        <span className="text-gray-500 text-sm">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.items.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  asChild 
                  className="flex-1"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/cart">View Cart</Link>
                </Button>
                <Button 
                  asChild 
                  className="flex-1 bg-haluna-primary hover:bg-haluna-primary-dark"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CartDropdown;
