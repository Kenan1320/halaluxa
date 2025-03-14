
import React from 'react';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Book,
  Coffee,
  Gift,
  Shirt,
  Store,
  Utensils,
  Sofa,
  ShoppingBasket,
  Heart,
  PenTool,
  User,
  Headphones
} from 'lucide-react';

interface CategoryIconProps {
  category: string;
  size?: number;
  color?: string;
  className?: string;
}

export const getCategoryIcon = (category: string, className: string = '') => {
  const normalizedCategory = category.toLowerCase();
  
  if (normalizedCategory.includes('grocer')) {
    return <ShoppingBasket className={className} />;
  } else if (normalizedCategory.includes('restaurant')) {
    return <Utensils className={className} />;
  } else if (normalizedCategory.includes('furniture')) {
    return <Sofa className={className} />;
  } else if (normalizedCategory.includes('meat')) {
    return <ShoppingBasket className={className} />;
  } else if (normalizedCategory.includes('book')) {
    return <Book className={className} />;
  } else if (normalizedCategory.includes('thobe')) {
    return <Shirt className={className} />;
  } else if (normalizedCategory.includes('hijab')) {
    return <Shirt className={className} />;
  } else if (normalizedCategory.includes('decoration')) {
    return <Home className={className} />;
  } else if (normalizedCategory.includes('abaya')) {
    return <Shirt className={className} />;
  } else if (normalizedCategory.includes('shop')) {
    return <Store className={className} />;
  } else if (normalizedCategory.includes('gift')) {
    return <Gift className={className} />;
  } else if (normalizedCategory.includes('calligraphy')) {
    return <PenTool className={className} />;
  } else if (normalizedCategory.includes('therapis')) {
    return <User className={className} />;
  } else if (normalizedCategory.includes('coffee')) {
    return <Coffee className={className} />;
  } else if (normalizedCategory.includes('hoodie')) {
    return <Shirt className={className} />;
  } else if (normalizedCategory.includes('pet')) {
    return <Heart className={className} />;
  } else if (normalizedCategory.includes('toy')) {
    return <Gift className={className} />;
  } else if (normalizedCategory.includes('cloth')) {
    return <Shirt className={className} />;
  } else if (normalizedCategory.includes('electronic')) {
    return <Headphones className={className} />;
  }
  
  // Default icon
  return <ShoppingCart className={className} />;
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 24, 
  color = 'currentColor',
  className = ''
}) => {
  return (
    <div className={className}>
      {getCategoryIcon(category, `w-${size} h-${size} text-${color}`)}
    </div>
  );
};

export default CategoryIcon;
