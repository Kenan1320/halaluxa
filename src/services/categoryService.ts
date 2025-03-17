
import { Category } from "@/types/database";
import { ShopGroup } from "@/types/database";

export interface CategoryWithIcon extends Omit<Category, 'group'> {
  icon: string;
  group: ShopGroup;
  created_at: string;
  updated_at: string;
}

export const getAllCategories = async (): Promise<CategoryWithIcon[]> => {
  // Simulate fetching categories from a database or API
  const categories: CategoryWithIcon[] = [
    {
      id: "grocery",
      name: "Grocery",
      icon: "Grocery",
      group: "online",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "restaurants",
      name: "Restaurants",
      icon: "Restaurant",
      group: "featured",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "pharmacy",
      name: "Pharmacy",
      icon: "Pharmacy",
      group: "nearby",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "electronics",
      name: "Electronics",
      icon: "Electronics",
      group: "popular",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "clothing",
      name: "Clothing",
      icon: "Clothing",
      group: "online",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "home-decor",
      name: "Home Decor",
      icon: "Home",
      group: "featured",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "bookstores",
      name: "Bookstores",
      icon: "Book",
      group: "nearby",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "toys-and-games",
      name: "Toys & Games",
      icon: "Toys",
      group: "popular",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "beauty-and-personal-care",
      name: "Beauty & Personal Care",
      icon: "Cosmetics",
      group: "online",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "sports-and-outdoors",
      name: "Sports & Outdoors",
      icon: "Fitness",
      group: "featured",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "pet-supplies",
      name: "Pet Supplies",
      icon: "Paw",
      group: "nearby",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "office-supplies",
      name: "Office Supplies",
      icon: "Stationery",
      group: "popular",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
  ];

  return categories;
};

export const getCategoriesByGroup = (group: ShopGroup): CategoryWithIcon[] => {
  const allGroups = getGroupedCategories();
  return allGroups[group] || [];
};

export const getGroupedCategories = () => {
  const groups: Record<ShopGroup, CategoryWithIcon[]> = {
    online: [
      {
        id: "online-grocery",
        name: "Grocery",
        icon: "Grocery",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "online-clothing",
        name: "Clothing",
        icon: "Clothing",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "online-beauty",
        name: "Beauty",
        icon: "Cosmetics",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    featured: [
      {
        id: "featured-restaurants",
        name: "Restaurants",
        icon: "Restaurant",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "featured-home-decor",
        name: "Home Decor",
        icon: "Home",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "featured-sports",
        name: "Sports",
        icon: "Fitness",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    nearby: [
      {
        id: "nearby-pharmacy",
        name: "Pharmacy",
        icon: "Pharmacy",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "nearby-bookstores",
        name: "Bookstores",
        icon: "Book",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "nearby-pet-supplies",
        name: "Pet Supplies",
        icon: "Paw",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    popular: [
      {
        id: "popular-electronics",
        name: "Electronics",
        icon: "Electronics",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "popular-toys",
        name: "Toys",
        icon: "Toys",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "popular-office",
        name: "Office",
        icon: "Stationery",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    transitional: [
      {
        id: "transitional-halal",
        name: "Halal",
        icon: "Halal",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "transitional-organic",
        name: "Organic",
        icon: "Organic",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: "transitional-vegetarian",
        name: "Vegetarian",
        icon: "Vegetarian",
        group: "transitional",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  };
  
  return groups;
};
