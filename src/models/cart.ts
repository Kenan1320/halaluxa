
import { Product, ShopProduct } from './product';
import { UUID } from './types';

export interface CartItem {
  product: Product | ShopProduct;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  shopId?: UUID; // If cart is specific to a shop
}

// Utility functions
export const calculateCartTotals = (items: CartItem[]): { totalItems: number, totalPrice: number } => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  return {
    totalItems,
    totalPrice
  };
};
