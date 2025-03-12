
import { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  translate: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simplified translations with only English
const translations: Record<string, Record<string, string>> = {
  en: {
    'Home': 'Home',
    'Shop': 'Shop',
    'Browse': 'Browse',
    'Browse Categories & Shops': 'Browse Categories & Shops',
    'Connect your Shop with your Customers and More': 'Connect your Shop with your Customers and More',
    'About': 'About',
    'Log In': 'Log In',
    'Sign Up': 'Sign Up',
    'Search': 'Search',
    'Orders': 'Orders',
    'Profile': 'Profile',
    'Logout': 'Logout',
    'Add to Cart': 'Add to Cart',
    'Buy Now': 'Buy Now',
    'Categories': 'Categories',
    'Shops Near You': 'Shops Near You',
    'View All': 'View All',
    'Your Cart': 'Your Cart',
    'Cart Items': 'Cart Items',
    'Clear Cart': 'Clear Cart',
    'Your cart is empty': 'Your cart is empty',
    'Looks like you haven\'t added any items to your cart yet. Check out our shop to find halal products from Muslim-owned businesses.': 'Looks like you haven\'t added any items to your cart yet. Check out our shop to find halal products from Muslim-owned businesses.',
    'Browse Products': 'Browse Products',
    'Category': 'Category',
    'Sold by': 'Sold by',
    'Order Summary': 'Order Summary',
    'Subtotal': 'Subtotal',
    'Shipping': 'Shipping',
    'Calculated at checkout': 'Calculated at checkout',
    'Total': 'Total',
    'Proceed to Checkout': 'Proceed to Checkout',
    'Continue Shopping': 'Continue Shopping',
    'Enable location': 'Enable location',
    'Location enabled': 'Location enabled',
    'Location updated': 'Location updated',
    'Location error': 'Location error',
    'Something went wrong getting your location': 'Something went wrong getting your location',
    'Location cleared': 'Location cleared',
    'Your location data has been removed': 'Your location data has been removed',
    'We\'ll show you shops and products near': 'We\'ll show you shops and products near',
    'Popular Categories': 'Popular Categories',
    'Discover Muslim Businesses': 'Discover Muslim Businesses',
    'Browse and support Muslim-owned businesses offering a wide range of halal products and services.': 'Browse and support Muslim-owned businesses offering a wide range of halal products and services.',
    'Search shops and businesses...': 'Search shops and businesses...',
    'Featured Shops': 'Featured Shops',
    'Shops in': 'Shops in',
    'No shops found': 'No shops found',
    'We couldn\'t find any shops matching your search.': 'We couldn\'t find any shops matching your search.',
    'Filter by location': 'Filter by location',
    'Clear Filters': 'Clear Filters',
    'Products': 'Products',
    'Verified': 'Verified',
    'Search The Hal Village with Halvi': 'Search The Hal Village with Halvi',
    'From Local Finds to Global Treasures!': 'From Local Finds to Global Treasures!',
    'Your Halal Village, All in One Place': 'Your Halal Village, All in One Place',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Always use English
  const language = 'en';
  
  const translate = (text: string): string => {
    if (!translations[language][text]) {
      console.warn(`Translation missing for "${text}" in ${language}`);
      return text;
    }
    return translations[language][text];
  };

  return (
    <LanguageContext.Provider value={{ language, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
