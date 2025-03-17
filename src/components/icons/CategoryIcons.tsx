
import React from 'react';

interface CategoryIconProps {
  className?: string;
}

// Halvi Local Categories
export const GroceriesIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/32a5af77-6580-431e-be2c-55a85c0924dc.png" 
    alt="Groceries" 
    className={className || "w-6 h-6"}
  />
);

export const RestaurantsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/5905cd07-a956-44a2-a562-d25465490821.png" 
    alt="Restaurants" 
    className={className || "w-6 h-6"}
  />
);

export const HalalMeatIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/eca6cb7b-9edc-40f9-9224-18bfaf36b4df.png" 
    alt="Halal Meat" 
    className={className || "w-6 h-6"}
  />
);

export const CoffeeShopsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/a17abac4-623f-4537-99c9-2469eb6a0214.png" 
    alt="Coffee Shops" 
    className={className || "w-6 h-6"}
  />
);

export const TherapistsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/ba41d842-f0ae-4e1a-bd56-edd9e49d57a2.png" 
    alt="Therapists" 
    className={className || "w-6 h-6"}
  />
);

export const FurnitureIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/c5a94586-b070-41f1-91ec-272ded3fba65.png" 
    alt="Furniture" 
    className={className || "w-6 h-6"}
  />
);

// Halvi Mall Categories
export const HoodiesIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/d597732e-d5b7-4dbf-a55e-af6bd21b7920.png" 
    alt="Hoodies" 
    className={className || "w-6 h-6"}
  />
);

export const ThobesIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/f3e114d7-728d-4a40-96eb-1dce0a5be2b7.png" 
    alt="Thobes" 
    className={className || "w-6 h-6"}
  />
);

export const AbayaIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/7e54c0aa-3e56-4b5b-b65a-097b5157ef64.png" 
    alt="Abaya" 
    className={className || "w-6 h-6"}
  />
);

export const BooksIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/962075f7-234c-4d60-8ab0-8d6304a54d98.png" 
    alt="Books" 
    className={className || "w-6 h-6"}
  />
);

export const FragranceIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/22e1328e-f107-41d7-a2d2-ca1ca33ef6fe.png" 
    alt="Fragrance" 
    className={className || "w-6 h-6"}
  />
);

export const JewelryIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/e6bb25d1-0e74-48dd-805b-a4e02f10efbd.png" 
    alt="Jewelry" 
    className={className || "w-6 h-6"}
  />
);

// Both (Transitional) Categories
export const ArabicCalligraphyIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/774f9824-5527-487e-bc66-c8e54bea1462.png" 
    alt="Arabic Calligraphy" 
    className={className || "w-6 h-6"}
  />
);

export const DecorationsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/22e1328e-f107-41d7-a2d2-ca1ca33ef6fe.png" 
    alt="Decorations" 
    className={className || "w-6 h-6"}
  />
);

export const GiftsIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/e6bb25d1-0e74-48dd-805b-a4e02f10efbd.png" 
    alt="Gifts" 
    className={className || "w-6 h-6"}
  />
);

export const ModestWearIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/baf9caf9-d512-4f0d-9232-8bcdb744a90c.png" 
    alt="Modest Wear" 
    className={className || "w-6 h-6"}
  />
);

export const OnlineStoresIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/d06ec500-7072-4304-aaca-a1903d007c85.png" 
    alt="Online Stores" 
    className={className || "w-6 h-6"}
  />
);

export const OthersIcon: React.FC<CategoryIconProps> = ({ className }) => (
  <img 
    src="/lovable-uploads/d06ec500-7072-4304-aaca-a1903d007c85.png" 
    alt="Others" 
    className={className || "w-6 h-6"}
  />
);

// A mapping function to get the right icon based on category name
export function getCategoryIcon(category: string, className?: string): React.ReactNode {
  const icons: Record<string, React.FC<CategoryIconProps>> = {
    // Halvi Local
    "Groceries": GroceriesIcon,
    "Restaurants": RestaurantsIcon,
    "Halal Meat": HalalMeatIcon,
    "Coffee Shops": CoffeeShopsIcon,
    "Therapists": TherapistsIcon,
    "Furniture": FurnitureIcon,
    
    // Halvi Mall
    "Hoodies": HoodiesIcon,
    "Thobes": ThobesIcon, 
    "Abaya": AbayaIcon,
    "Books": BooksIcon,
    "Fragrance": FragranceIcon,
    "Jewelry": JewelryIcon,
    
    // Both (Transitional)
    "Arabic Calligraphy": ArabicCalligraphyIcon,
    "Decorations": DecorationsIcon,
    "Gifts": GiftsIcon,
    "Modest Wear": ModestWearIcon,
    "Online Stores": OnlineStoresIcon,
    "Others": OthersIcon,
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
