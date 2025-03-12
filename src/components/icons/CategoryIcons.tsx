
import React from 'react';

interface CategoryIconProps {
  className?: string;
}

export const GroceriesIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/7d4d7ce4-8005-40dd-8d08-d3dba87a472f.png" 
    alt="Groceries" 
    className={className || "w-6 h-6"}
  />
);

export const RestaurantsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/790899d7-ac89-43da-8f6b-9ce5a220f6fb.png" 
    alt="Restaurants" 
    className={className || "w-6 h-6"}
  />
);

export const HalalMeatIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/32a5af77-6580-431e-be2c-55a85c0924dc.png" 
    alt="Halal Meat" 
    className={className || "w-6 h-6"}
  />
);

export const FurnitureIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/756f142d-1390-4a6b-8968-d373b1969765.png" 
    alt="Furniture" 
    className={className || "w-6 h-6"}
  />
);

export const BooksIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/5905cd07-a956-44a2-a562-d25465490821.png" 
    alt="Books" 
    className={className || "w-6 h-6"}
  />
);

export const ModestClothingIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/f3e114d7-728d-4a40-96eb-1dce0a5be2b7.png" 
    alt="Modest Clothing" 
    className={className || "w-6 h-6"}
  />
);

export const HijabIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/e6bb25d1-0e74-48dd-805b-a4e02f10efbd.png" 
    alt="Hijab" 
    className={className || "w-6 h-6"}
  />
);

export const ThobesIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/baf9caf9-d512-4f0d-9232-8bcdb744a90c.png" 
    alt="Thobes" 
    className={className || "w-6 h-6"}
  />
);

export const AbayaIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/22e1328e-f107-41d7-a2d2-ca1ca33ef6fe.png" 
    alt="Abaya" 
    className={className || "w-6 h-6"}
  />
);

export const OnlineShopsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/1ce7abeb-3667-493b-8134-20ef3510bcbe.png" 
    alt="Online Shops" 
    className={className || "w-6 h-6"}
  />
);

export const GiftsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/e9ac626b-f1b0-4d4e-876e-7ce5e6551bbc.png" 
    alt="Gifts" 
    className={className || "w-6 h-6"}
  />
);

export const DecorationsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/7e54c0aa-3e56-4b5b-b65a-097b5157ef64.png" 
    alt="Decorations" 
    className={className || "w-6 h-6"}
  />
);

export const ArabicLanguageIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/d06ec500-7072-4304-aaca-a1903d007c85.png" 
    alt="Arabic Language" 
    className={className || "w-6 h-6"}
  />
);

export const ArabicCalligraphyIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/962075f7-234c-4d60-8ab0-8d6304a54d98.png" 
    alt="Arabic Calligraphy" 
    className={className || "w-6 h-6"}
  />
);

// A mapping function to get the right icon based on category name
export function getCategoryIcon(category: string, className?: string): React.ReactNode {
  const icons: Record<string, React.FC<CategoryIconProps>> = {
    "Groceries": GroceriesIcon,
    "Restaurants": RestaurantsIcon,
    "Halal Meat": HalalMeatIcon,
    "Furniture": FurnitureIcon,
    "Books": BooksIcon,
    "Modest Clothing": ModestClothingIcon, 
    "Hijab": HijabIcon,
    "Thobes": ThobesIcon,
    "Abaya": AbayaIcon,
    "Online Shops": OnlineShopsIcon,
    "Gifts": GiftsIcon,
    "Decorations": DecorationsIcon,
    "Arabic Language": ArabicLanguageIcon,
    "Arabic Calligraphy": ArabicCalligraphyIcon
  };
  
  const IconComponent = icons[category];
  
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  
  // Default fallback
  return <div className={`bg-gray-200 rounded-full flex items-center justify-center ${className || "w-6 h-6"}`}>
    <span className="text-xs">{category.charAt(0)}</span>
  </div>;
}
