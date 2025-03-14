
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

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  category, 
  size = 24, 
  color = 'currentColor',
  className = ''
}) => {
  const normalizedCategory = category.toLowerCase();
  
  const getIcon = () => {
    if (normalizedCategory.includes('grocer')) {
      return <ShoppingBasket size={size} color={color} />;
    } else if (normalizedCategory.includes('restaurant')) {
      return <Utensils size={size} color={color} />;
    } else if (normalizedCategory.includes('furniture')) {
      return <Sofa size={size} color={color} />;
    } else if (normalizedCategory.includes('meat')) {
      return <ShoppingBasket size={size} color={color} />;
    } else if (normalizedCategory.includes('book')) {
      return <Book size={size} color={color} />;
    } else if (normalizedCategory.includes('thobe')) {
      return <Shirt size={size} color={color} />;
    } else if (normalizedCategory.includes('hijab')) {
      return <Shirt size={size} color={color} />;
    } else if (normalizedCategory.includes('decoration')) {
      return <Home size={size} color={color} />;
    } else if (normalizedCategory.includes('abaya')) {
      return <Shirt size={size} color={color} />;
    } else if (normalizedCategory.includes('shop')) {
      return <Store size={size} color={color} />;
    } else if (normalizedCategory.includes('gift')) {
      return <Gift size={size} color={color} />;
    } else if (normalizedCategory.includes('calligraphy')) {
      return <PenTool size={size} color={color} />;
    } else if (normalizedCategory.includes('therapis')) {
      return <User size={size} color={color} />;
    } else if (normalizedCategory.includes('coffee')) {
      return <Coffee size={size} color={color} />;
    } else if (normalizedCategory.includes('hoodie')) {
      return <Shirt size={size} color={color} />;
    } else if (normalizedCategory.includes('pet')) {
      return <Heart size={size} color={color} />; // Changed from DogBowl to Heart
    } else if (normalizedCategory.includes('toy')) {
      return <Gift size={size} color={color} />;
    } else if (normalizedCategory.includes('cloth')) {
      return <Shirt size={size} color={color} />;
    } else if (normalizedCategory.includes('electronic')) {
      return <Headphones size={size} color={color} />;
    }
    
    // Default icon
    return <ShoppingCart size={size} color={color} />;
  };
  
  return (
    <div className={className}>
      {getIcon()}
    </div>
  );
};

export default CategoryIcon;
