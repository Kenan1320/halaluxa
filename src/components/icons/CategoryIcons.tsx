
import React from 'react';
import { 
  ShoppingBag, 
  Store, 
  Utensils, 
  Coffee, 
  Shirt, 
  Salad, 
  Book, 
  Gift, 
  Truck, 
  Smartphone, 
  DogBowl,
  Home,
  BadgeDollarSign,
  Baby,
  Scissors,
  Dumbbell
} from 'lucide-react';

export function getCategoryIcon(categoryName: string, className: string = 'w-6 h-6') {
  // Convert the category name to lowercase for case-insensitive matching
  const category = categoryName.toLowerCase();
  
  // Map each category to an appropriate icon
  if (category.includes('grocer')) {
    return <ShoppingBag className={className} />;
  } 
  else if (category.includes('online') || category.includes('store')) {
    return <Store className={className} />;
  } 
  else if (category.includes('restaurant')) {
    return <Utensils className={className} />;
  } 
  else if (category.includes('coffee')) {
    return <Coffee className={className} />;
  } 
  else if (category.includes('clothing') || category.includes('hoodie') || category.includes('thobe') || category.includes('abaya')) {
    return <Shirt className={className} />;
  } 
  else if (category.includes('meat') || category.includes('food')) {
    return <Salad className={className} />;
  } 
  else if (category.includes('book')) {
    return <Book className={className} />;
  } 
  else if (category.includes('kid') || category.includes('baby')) {
    return <Baby className={className} />;
  } 
  else if (category.includes('gift')) {
    return <Gift className={className} />;
  } 
  else if (category.includes('delivery')) {
    return <Truck className={className} />;
  } 
  else if (category.includes('electronic')) {
    return <Smartphone className={className} />;
  } 
  else if (category.includes('pet')) {
    return <DogBowl className={className} />;
  } 
  else if (category.includes('home') || category.includes('garden')) {
    return <Home className={className} />;
  } 
  else if (category.includes('health') || category.includes('fitness')) {
    return <Dumbbell className={className} />;
  } 
  // Default icon for any other category
  else {
    return <BadgeDollarSign className={className} />;
  }
}
