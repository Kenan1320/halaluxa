
import React from 'react';
import { Store, ShoppingBag, Book, Shirt, Coffee, Gift, Utensils, FileText, Home, CircleUser, Scissors, Briefcase, Leaf, Sparkles } from 'lucide-react';

export const getCategoryIcon = (category: string, className?: string) => {
  switch (category.toLowerCase()) {
    case 'groceries':
      return <ShoppingBag className={className} />;
    case 'restaurants':
      return <Utensils className={className} />;
    case 'furniture':
      return <Home className={className} />;
    case 'halal meat':
      return <Leaf className={className} />;
    case 'books':
      return <Book className={className} />;
    case 'thobes':
      return <Shirt className={className} />;
    case 'hijab':
      return <Shirt className={className} />;
    case 'decorations':
      return <Sparkles className={className} />;
    case 'abaya':
      return <Shirt className={className} />;
    case 'online shops':
      return <Store className={className} />;
    case 'gifts':
      return <Gift className={className} />;
    case 'arabic calligraphy':
      return <FileText className={className} />;
    case 'muslim therapists':
      return <CircleUser className={className} />;
    case 'coffee shops':
      return <Coffee className={className} />;
    case 'hoodies':
      return <Shirt className={className} />;
    case 'islamic center':
      return <Home className={className} />; // Replacing Mosque with Home
    default:
      return <Store className={className} />;
  }
};
