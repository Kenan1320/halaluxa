
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag, X, ShoppingCart, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    navigate('/checkout');
    setIsOpen(false);
  };

  const handleViewCart = () => {
    navigate('/cart');
    setIsOpen(false);
  };

  // Only show if there are items in the cart
  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Cart Indicator Button */}
      <button
        onClick={toggleDropdown}
        className="fixed bottom-6 right-6 bg-haluna-primary text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="h-6 w-6" />
        {cart.items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cart.items.length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={isOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden ${
          !isOpen && 'pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Cart ({cart.items.length})
          </h3>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="max-h-60 overflow-y-auto p-4 space-y-3">
          {cart.items.map((item) => (
            <div key={item.product.id} className="flex gap-2">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {item.product.images && item.product.images.length > 0 ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-haluna-primary font-medium text-sm">
                    {formatPrice(item.product.price)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      aria-label="Decrease quantity"
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <span className="text-xs w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      aria-label="Increase quantity"
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-gray-400 hover:text-red-500 p-1"
                aria-label="Remove item"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total</span>
            <span className="font-bold text-haluna-primary">{formatPrice(cart.totalPrice)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleViewCart}
              variant="outline"
              className="w-full"
            >
              View Cart
            </Button>
            <Button
              onClick={handleCheckout}
              className="w-full"
            >
              Checkout
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CartDropdown;
