
import React from 'react';
import { TopNavigationBar } from '../navigation/TopNavigationBar';

export const TopNavigationBarExample: React.FC = () => {
  // Sample data for demonstration
  const nearbyShopsData = [
    { name: "Fresh Market", avatar: "/placeholder.svg" },
    { name: "Organic Foods", avatar: "/placeholder.svg" },
    { name: "Spice World", avatar: "/placeholder.svg" },
    { name: "Halal Meats", avatar: "/placeholder.svg" },
    { name: "Bakery Fresh", avatar: "/placeholder.svg" },
    { name: "Daily Dairy", avatar: "/placeholder.svg" },
    { name: "Sweet Treats", avatar: "/placeholder.svg" },
    { name: "Green Grocer", avatar: "/placeholder.svg" },
    { name: "Local Farms", avatar: "/placeholder.svg" },
    { name: "Seafood Supply", avatar: "/placeholder.svg" },
  ];

  const featureProductsData = [
    { name: "Organic Apples", price: 2.99, image: "/placeholder.svg" },
    { name: "Fresh Salmon", price: 12.99, image: "/placeholder.svg" },
    { name: "Whole Grain Bread", price: 3.49, image: "/placeholder.svg" },
    { name: "Free Range Eggs", price: 4.99, image: "/placeholder.svg" },
    { name: "Grass-Fed Beef", price: 9.99, image: "/placeholder.svg" },
    { name: "Almond Milk", price: 3.29, image: "/placeholder.svg" },
    { name: "Organic Honey", price: 6.99, image: "/placeholder.svg" },
    { name: "Mediterranean Olives", price: 5.49, image: "/placeholder.svg" },
    { name: "Avocado Oil", price: 8.99, image: "/placeholder.svg" },
    { name: "Quinoa", price: 4.79, image: "/placeholder.svg" },
  ];

  return (
    <div className="w-full">
      <TopNavigationBar
        logo={{ src: "/logo-base.svg", alt: "Haluna Logo" }}
        applicationName="Haluna"
        search={{ placeholder: "Search" }}
        categories={{ placeholder: "Categories" }}
        platform={{ placeholder: "Buy Now" }}
        nearbyShops={{ data: nearbyShopsData }}
        featureProducts={{ data: featureProductsData }}
        useShimmer={false}
        error=""
      />
    </div>
  );
};
