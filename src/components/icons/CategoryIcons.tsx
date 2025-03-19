
import React from 'react';
import { 
  ShoppingCart, 
  Coffee, 
  Utensils, 
  Home, 
  BookOpen, 
  Shirt, 
  Gift, 
  Heart, 
  Landmark, 
  Smartphone, 
  Store,
  Scissors,
  Droplet,
  UtensilsCrossed,
  ChefHat,
  Sofa,
  PenTool,
  Sparkles,
  PackageOpen,
  ShoppingBag,
  Languages,
  HeartPulse,
  Scroll
} from 'lucide-react';

export const getCategoryIcon = (categoryName: string, className = 'w-6 h-6'): JSX.Element => {
  const iconMap: Record<string, JSX.Element> = {
    'Groceries': <ShoppingCart className={className} />,
    'Restaurants': <Utensils className={className} />,
    'Halal Meat': <UtensilsCrossed className={className} />,
    'Coffee Shops': <Coffee className={className} />,
    'Muslim Therapists': <HeartPulse className={className} />,
    'Furniture': <Sofa className={className} />,
    'Arabic Calligraphy': <PenTool className={className} />,
    'Arabic Language': <Languages className={className} />,
    'Decorations': <Sparkles className={className} />,
    'Gifts': <Gift className={className} />,
    'Thobes': <Shirt className={className} />,
    'Abayas': <Shirt className={className} />,
    'Hijabs': <Shirt className={className} />,
    'Modest Wear': <Shirt className={className} />,
    'Online Stores': <ShoppingBag className={className} />,
    'Others': <PackageOpen className={className} />,
    'Hoodies': <Shirt className={className} />,
    'Books': <BookOpen className={className} />,
    'Fragrance': <Droplet className={className} />,
    'Jewelry': <Sparkles className={className} />,
    'Electronics': <Smartphone className={className} />,
    'Home': <Home className={className} />,
    'Food': <ChefHat className={className} />,
    'Beauty': <Scissors className={className} />,
    'Fashion': <Shirt className={className} />,
    'Default': <Store className={className} />
  };

  return iconMap[categoryName] || iconMap['Default'];
};

// For backward compatibility
export const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
  return getCategoryIcon(category, className);
};

export default CategoryIcon;
