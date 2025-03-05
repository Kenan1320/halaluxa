
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem } from '@/models/cart';
import { Product } from '@/models/product';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
  };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({ items: [], totalItems: 0, totalPrice: 0 });
  const { toast } = useToast();
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to parse saved cart', error);
      }
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.id === product.id
      );
      
      let newItems;
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Add new item
        newItems = [...prevCart.items, { product, quantity }];
      }
      
      const { totalItems, totalPrice } = calculateCartTotals(newItems);
      
      toast({
        title: "Added to cart",
        description: `${product.name} (${quantity}) added to your cart`,
      });
      
      return {
        items: newItems,
        totalItems,
        totalPrice
      };
    });
  };
  
  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      const { totalItems, totalPrice } = calculateCartTotals(newItems);
      
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart",
      });
      
      return {
        items: newItems,
        totalItems,
        totalPrice
      };
    });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const newItems = prevCart.items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
      
      const { totalItems, totalPrice } = calculateCartTotals(newItems);
      
      return {
        items: newItems,
        totalItems,
        totalPrice
      };
    });
  };
  
  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
