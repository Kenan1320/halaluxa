import { Category } from "@/types/database";

export interface CategoryWithIcon extends Category {
  icon: string;
  group: "online" | "featured" | "nearby" | "popular" | "transitional";
}

export const getAllCategories = async (): Promise<CategoryWithIcon[]> => {
  // Simulate fetching categories from a database or API
  const categories: CategoryWithIcon[] = [
    {
      id: "grocery",
      name: "Grocery",
      icon: "Grocery",
      group: "online"
    },
    {
      id: "restaurants",
      name: "Restaurants",
      icon: "Restaurant",
      group: "featured"
    },
    {
      id: "pharmacy",
      name: "Pharmacy",
      icon: "Pharmacy",
      group: "nearby"
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: "Electronics",
      group: "popular"
    },
    {
      id: "clothing",
      name: "Clothing",
      icon: "Clothing",
      group: "online"
    },
    {
      id: "home-decor",
      name: "Home Decor",
      icon: "Home",
      group: "featured"
    },
    {
      id: "bookstores",
      name: "Bookstores",
      icon: "Book",
      group: "nearby"
    },
    {
      id: "toys-and-games",
      name: "Toys & Games",
      icon: "Toys",
      group: "popular"
    },
    {
      id: "beauty-and-personal-care",
      name: "Beauty & Personal Care",
      icon: "Cosmetics",
      group: "online"
    },
    {
      id: "sports-and-outdoors",
      name: "Sports & Outdoors",
      icon: "Fitness",
      group: "featured"
    },
    {
      id: "pet-supplies",
      name: "Pet Supplies",
      icon: "Paw",
      group: "nearby"
    },
    {
      id: "office-supplies",
      name: "Office Supplies",
      icon: "Stationery",
      group: "popular"
    },
  ];

  return categories;
};

export const getGroupedCategories = () => {
  const groups: Record<string, CategoryWithIcon[]> = {
    online: [
      {
        id: "online-grocery",
        name: "Grocery",
        icon: "Grocery",
        group: "transitional"
      },
      {
        id: "online-clothing",
        name: "Clothing",
        icon: "Clothing",
        group: "transitional"
      },
      {
        id: "online-beauty",
        name: "Beauty",
        icon: "Cosmetics",
        group: "transitional"
      }
    ],
    featured: [
      {
        id: "featured-restaurants",
        name: "Restaurants",
        icon: "Restaurant",
        group: "transitional"
      },
      {
        id: "featured-home-decor",
        name: "Home Decor",
        icon: "Home",
        group: "transitional"
      },
      {
        id: "featured-sports",
        name: "Sports",
        icon: "Fitness",
        group: "transitional"
      }
    ],
    nearby: [
      {
        id: "nearby-pharmacy",
        name: "Pharmacy",
        icon: "Pharmacy",
        group: "transitional"
      },
      {
        id: "nearby-bookstores",
        name: "Bookstores",
        icon: "Book",
        group: "transitional"
      },
      {
        id: "nearby-pet-supplies",
        name: "Pet Supplies",
        icon: "Paw",
        group: "transitional"
      }
    ],
    popular: [
      {
        id: "popular-electronics",
        name: "Electronics",
        icon: "Electronics",
        group: "transitional"
      },
      {
        id: "popular-toys",
        name: "Toys",
        icon: "Toys",
        group: "transitional"
      },
      {
        id: "popular-office",
        name: "Office",
        icon: "Stationery",
        group: "transitional"
      }
    ],
    transitional: [
      {
        id: "transitional-halal",
        name: "Halal",
        icon: "Halal",
        group: "transitional"
      },
      {
        id: "transitional-organic",
        name: "Organic",
        icon: "Organic",
        group: "transitional"
      },
      {
        id: "transitional-vegetarian",
        name: "Vegetarian",
        icon: "Vegetarian",
        group: "transitional"
      }
    ]
  };
  
  return groups;
};
