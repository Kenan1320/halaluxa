
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  toggleLanguage: () => void;
  translate: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Enhanced translations for a better multilingual experience
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
  },
  ar: {
    'Home': 'الرئيسية',
    'Shop': 'تسوق',
    'Browse': 'تصفح',
    'Browse Categories & Shops': 'تصفح الفئات والمتاجر',
    'Connect your Shop with your Customers and More': 'اربط متجرك بعملائك والمزيد',
    'About': 'عن هالونا',
    'Log In': 'تسجيل الدخول',
    'Sign Up': 'إنشاء حساب',
    'Search': 'بحث',
    'Orders': 'الطلبات',
    'Profile': 'الملف الشخصي',
    'Logout': 'تسجيل الخروج',
    'Add to Cart': 'أضف إلى السلة',
    'Buy Now': 'اشتري الآن',
    'Categories': 'الفئات',
    'Shops Near You': 'المتاجر القريبة منك',
    'View All': 'عرض الكل',
    'Your Cart': 'عربة التسوق',
    'Cart Items': 'العناصر في السلة',
    'Clear Cart': 'إفراغ السلة',
    'Your cart is empty': 'سلة التسوق فارغة',
    'Looks like you haven\'t added any items to your cart yet. Check out our shop to find halal products from Muslim-owned businesses.': 'يبدو أنك لم تضف أي عناصر إلى سلة التسوق بعد. تصفح متجرنا للعثور على منتجات حلال من الشركات المملوكة للمسلمين.',
    'Browse Products': 'تصفح المنتجات',
    'Category': 'الفئة',
    'Sold by': 'يباع من قبل',
    'Order Summary': 'ملخص الطلب',
    'Subtotal': 'المجموع الفرعي',
    'Shipping': 'الشحن',
    'Calculated at checkout': 'يحسب عند الدفع',
    'Total': 'الإجمالي',
    'Proceed to Checkout': 'متابعة الدفع',
    'Continue Shopping': 'مواصلة التسوق',
    'Enable location': 'تفعيل الموقع',
    'Location enabled': 'تم تفعيل الموقع',
    'Location updated': 'تم تحديث الموقع',
    'Location error': 'خطأ في الموقع',
    'Something went wrong getting your location': 'حدث خطأ في الحصول على موقعك',
    'Location cleared': 'تم مسح الموقع',
    'Your location data has been removed': 'تم إزالة بيانات موقعك',
    'We\'ll show you shops and products near': 'سنعرض لك المتاجر والمنتجات بالقرب من',
    'Popular Categories': 'الفئات الشعبية',
    'Discover Muslim Businesses': 'اكتشف الشركات الإسلامية',
    'Browse and support Muslim-owned businesses offering a wide range of halal products and services.': 'تصفح وادعم الشركات المملوكة للمسلمين التي تقدم مجموعة واسعة من المنتجات والخدمات الحلال.',
    'Search shops and businesses...': 'البحث عن المتاجر والشركات...',
    'Featured Shops': 'المتاجر المميزة',
    'Shops in': 'المتاجر في',
    'No shops found': 'لم يتم العثور على متاجر',
    'We couldn\'t find any shops matching your search.': 'لم نتمكن من العثور على أي متاجر تطابق بحثك.',
    'Filter by location': 'تصفية حسب الموقع',
    'Clear Filters': 'مسح المرشحات',
    'Products': 'المنتجات',
    'Verified': 'موثّق',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get saved language preference from localStorage
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    // Update class for RTL styling
    if (language === 'ar') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const translate = (text: string): string => {
    if (!translations[language][text]) {
      console.warn(`Translation missing for "${text}" in ${language}`);
      return text;
    }
    return translations[language][text];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, translate }}>
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
