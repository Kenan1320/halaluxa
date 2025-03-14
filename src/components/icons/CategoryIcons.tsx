
import React from 'react';
import { 
  ShoppingCart, 
  Coffee, 
  Shirt, 
  Home, 
  Book, 
  Laptop, 
  Gift, 
  Utensils,
  Store,
  ShoppingBag,
  Heart,
  Star,
  MilkOff,
  Tags,
  Music,
  Sparkles,
  FileText,
  Dumbbell,
  MedicalCross,
  Headphones,
  Baby,
  Gamepad2,
  Beef,
  Brush,
  Grid3X3
} from 'lucide-react';

interface CategoryIconMap {
  [key: string]: React.ReactNode;
}

const iconMap: CategoryIconMap = {
  "Groceries": <ShoppingCart />,
  "Restaurants": <Utensils />,
  "Furniture": <Home />,
  "Halal Meat": <Beef />,
  "Books": <Book />,
  "Thobes": <Shirt />,
  "Hijab": <Shirt />,
  "Decorations": <Sparkles />,
  "Abaya": <Shirt />,
  "Online Shops": <ShoppingBag />,
  "Gifts": <Gift />,
  "Arabic Calligraphy": <FileText />,
  "Muslim Therapists": <Heart />,
  "Coffee Shops": <Coffee />,
  "Hoodies": <Shirt />,
  "Fashion": <Shirt />,
  "Electronics": <Laptop />,
  "Beauty & Wellness": <Brush />,
  "Toys & Games": <Gamepad2 />,
  "Health & Fitness": <Dumbbell />,
  "Islamic Goods": <Star />,
  "Food & Groceries": <ShoppingCart />,
  "Home & Decor": <Home />,
  "Books & Stationery": <Book />,
  "Services": <MedicalCross />,
  "Clothing": <Shirt />,
  "Other": <Grid3X3 />
};

export const getCategoryIcon = (categoryName: string, className?: string): React.ReactElement => {
  const CategoryIcon = iconMap[categoryName] || <Store />;
  
  // Clone the element with the provided className
  if (React.isValidElement(CategoryIcon)) {
    return React.cloneElement(CategoryIcon as React.ReactElement, { className });
  }
  
  // Fallback to Store icon
  return <Store className={className} />;
};
