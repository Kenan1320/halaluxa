
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  toggleLanguage: () => void;
  translate: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simplified translations - in a real app, this would be much more extensive
const translations: Record<string, Record<string, string>> = {
  en: {
    'Home': 'Home',
    'Shop': 'Shop',
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
  },
  ar: {
    'Home': 'الرئيسية',
    'Shop': 'تسوق',
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
